import { Request, Response, NextFunction } from "express";
import { pool } from "..";
import { OkPacket, RowDataPacket } from "mysql2";

interface Parameter {
  name: string;
  description?: string | null;
  unit_id?: number | null;
  unit_name?: string | null;
  unit_description?: string | null;
  datatype?: string | null;
  decimals?: number | null;
  min?: number | null;
  max?: number | null;
  creation_date?: Date | null;
  modified_date?: Date | null;
  rigfamily_id?: number[] | null;
  rigfamily_name?: string[] | null;
  rigfamily_description?: string[] | null;
  comment?: string | null;
  created_by?: number | null;
  modified_by?: number | null;
  

  
}

// Get all parameters
export const getParameters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT p.id, p.name, p.description, p.datatype, p.decimals, p.min, p.max, p.creation_date, p.modified_date, p.created_by, p.modified_by, p.comment, 
      u.name AS unit_name, u.description AS unit_description, rf.name AS rigfamily_name, rf.description AS rigfamily_description, 
      GROUP_CONCAT(img.name SEPARATOR ';') AS image_name, GROUP_CONCAT(img.description SEPARATOR ';') AS image_description, GROUP_CONCAT(img.url SEPARATOR ';') AS image_urls
      FROM parameters p 
      LEFT JOIN units u ON p.unit_id = u.id 
      LEFT JOIN rigfamily rf ON p.rigfamily_id = rf.id 
      LEFT JOIN parameter_rigfamily pr ON p.id = pr.parameter_id 
      LEFT JOIN images img ON p.id = img.parameter_id 
      GROUP BY p.id`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Get a parameter by id
export const getParameter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT p.id, p.name, p.description, p.datatype, p.decimals, p.min, p.max, p.creation_date, p.modified_date, p.created_by, p.modified_by, p.comment, 
      u.name AS unit_name, u.description AS unit_description, rf.name AS rigfamily_name, rf.description AS rigfamily_description, 
      GROUP_CONCAT(img.name SEPARATOR ';') AS image_name, GROUP_CONCAT(img.description SEPARATOR ';') AS image_description, GROUP_CONCAT(img.url SEPARATOR ';') AS image_urls
      FROM parameters p 
      LEFT JOIN units u ON p.unit_id = u.id 
      LEFT JOIN rigfamily rf ON p.rigfamily_id = rf.id 
      LEFT JOIN parameter_rigfamily pr ON p.id = pr.parameter_id 
      LEFT JOIN images img ON p.id = img.parameter_id 
      WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows[0].id === null) {
      return res.status(404).json({ msg: "Parameter not found" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

interface NewParameter {
  name: string;
  description?: string | null;
  unit?: {
    name: string;
    description?: string;
  } | null;
  rigfamily?: {
    name: string;
    description?: string;
  } | null;
  datatype?: string | null;
  decimals?: number | null;
  min?: number | null;
  max?: number | null;
  comment?: string | null;
  images?: {
    name?: string;
    description?: string;
    url: string;
  } | null;
  created_by?: number | null;
  modified_by?: number | null;
  creation_date?: Date | null;
  modified_date?: Date | null;
}

export const createParameters = async (req: Request, res: Response) => {
  const conn = await pool.getConnection();
  const newParameters: NewParameter[] = req.body;
  console.log(newParameters);

  try {
    await conn.beginTransaction();

    for (const newParameter of newParameters) {
      // Insert new unit if not exists
      let unitId = null;
      if (newParameter.unit) {
        const [unitRows] = await conn.query(
          `SELECT id FROM units WHERE name = ? LIMIT 1`,
          [newParameter.unit.name]
        ) as RowDataPacket[];
        if (unitRows.length > 0) {
          unitId = unitRows[0].id;
        } else {
          const [unitResult] = await conn.query(
            `INSERT INTO units (name, description) VALUES (?, ?)`,
            [newParameter.unit.name, newParameter.unit.description || null]
          );
          unitId = (unitResult as OkPacket).insertId;
        }
      }

      // Insert new rigfamily if not exists
      let rigfamilyId = null;
      if (newParameter.rigfamily) {
        const [rigfamilyRows] = await conn.query(
          `SELECT id FROM rigfamily WHERE name = ? LIMIT 1`,
          [newParameter.rigfamily.name]
        )as RowDataPacket[];
        if (rigfamilyRows.length > 0) {
          rigfamilyId = rigfamilyRows[0].id;
        } else {
          const [rigfamilyResult] = await conn.query(
            `INSERT INTO rigfamily (name, description) VALUES (?, ?)`,
            [newParameter.rigfamily.name, newParameter.rigfamily.description || null]
          );
          rigfamilyId = (rigfamilyResult as OkPacket).insertId;
        }
      }

      // Insert new parameter
      const [parameterResult] = await conn.query(
        `INSERT INTO parameters (name, description, unit_id, rigfamily_id, datatype, decimals, min, max, comment, created_by, modified_by, creation_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newParameter.name,
          newParameter.description || null,
          unitId,
          rigfamilyId,
          newParameter.datatype || null,
          newParameter.decimals || null,
          newParameter.min || null,
          newParameter.max || null,
          newParameter.comment || null,
          newParameter.created_by || null,
          newParameter.modified_by || null,
          new Date(newParameter.creation_date) || null,
          new Date(newParameter.modified_date) || null,
        ]
      );
      console.log((parameterResult as OkPacket).insertId);
      const parameterId = (parameterResult as OkPacket).insertId;

      // Insert parameter into rigfamily
      if (rigfamilyId) {
        await conn.query(
          `INSERT INTO parameter_rigfamily (parameter_id, rigfamily_id) VALUES (?, ?)`,
          [parameterId, rigfamilyId]
        );
      }

      // Insert new images if any
    if (newParameter.images) {
      const urls = newParameter.images.url.split(';').map(url => url.trim());
      const names = newParameter.images.name ? newParameter.images.name.split(';').map(name => name.trim()) : Array(urls.length).fill(null);
      const descriptions = newParameter.images.description ? newParameter.images.description.split(';').map(desc => desc.trim()) : Array(urls.length).fill(null);
  

      const images = urls.map((url, index) => ({
        url,
        name: names[index],
        description: descriptions[index]
      }));
      const imageValues = images.map(
        (image) => `(${parameterId}, '${image.name}', '${image.description || ""}', '${image.url}')`
      );
      await conn.query(
        `INSERT INTO images (parameter_id, name, description, url) VALUES ${imageValues.join(",")}`
      );
    }
    }

    await conn.commit();
    res.status(200).json({ message: 'Parameters created successfully' })
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  } finally {
    conn.release();
  }
};
    
// Update a parameter
export const updateParameter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parameter: Parameter = req.body;
    const [rows, fields] = await pool.query(
      "UPDATE parameter SET ? WHERE id = ?",
      [parameter, req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Delete a parameter
export const deleteParameter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows, fields] = await pool.query(
      "DELETE FROM parameter WHERE id = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export default {
  getParameters,
  getParameter,
  createParameters,
  updateParameter,
  deleteParameter,
};
