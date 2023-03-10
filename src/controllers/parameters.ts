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
      u.name AS unit_name, u.description AS unit_description,  GROUP_CONCAT(DISTINCT rf.name ORDER BY rf.id ASC SEPARATOR ';')  AS rigfamily_name,  GROUP_CONCAT(DISTINCT rf.description ORDER BY rf.id ASC SEPARATOR ';') AS rigfamily_description, 
      GROUP_CONCAT(DISTINCT img.name ORDER BY img.id ASC SEPARATOR ';') AS image_name, GROUP_CONCAT(DISTINCT img.description ORDER BY img.id ASC SEPARATOR ';') AS image_description, GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC SEPARATOR ';') AS image_urls
      FROM parameters p 
      LEFT JOIN units u ON p.unit_id = u.id 
      LEFT JOIN images img ON p.id = img.parameter_id 
      LEFT JOIN parameter_rigfamily pr ON pr.parameter_id = p.id 
      LEFT JOIN rigfamily rf ON rf.id = pr.rigfamily_id
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
      u.name AS unit_name, u.description AS unit_description,  GROUP_CONCAT(DISTINCT rf.name ORDER BY rf.id ASC SEPARATOR ';')  AS rigfamily_name,  GROUP_CONCAT(DISTINCT rf.description ORDER BY rf.id ASC SEPARATOR ';') AS rigfamily_description, 
      GROUP_CONCAT(DISTINCT img.name ORDER BY img.id ASC SEPARATOR ';') AS image_name, GROUP_CONCAT(DISTINCT img.description ORDER BY img.id ASC SEPARATOR ';') AS image_description, GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC SEPARATOR ';') AS image_urls
      FROM parameters p 
      LEFT JOIN units u ON p.unit_id = u.id 
      LEFT JOIN images img ON p.id = img.parameter_id 
      LEFT JOIN parameter_rigfamily pr ON pr.parameter_id = p.id 
      LEFT JOIN rigfamily rf ON rf.id = pr.rigfamily_id
      WHERE p.id = ?;
      `,
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
  created_by?: string | null;
  modified_by?: string | null;
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
        const [unitRows] = (await conn.query(
          `SELECT id FROM units WHERE name = ? LIMIT 1`,
          [newParameter.unit.name]
        )) as RowDataPacket[];
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
      // Split rigfamily name and description into arrays using ; as separator and loop through them
      const rigfamilyId: number[] = [];
      let rigfamilyDescription = [];
      if (newParameter.rigfamily) {
        let rigfamilyName = newParameter.rigfamily.name.split(";");
        if (newParameter.rigfamily.description) {
          rigfamilyDescription = newParameter.rigfamily.description.split(";");
        } else {
          rigfamilyDescription = Array(rigfamilyName.length).fill("");
        }
        for (let i = 0; i < rigfamilyName.length; i++) {
          const [rigfamilyRows] = (await conn.query(
            `SELECT id FROM rigfamily WHERE name = ? LIMIT 1`,
            [rigfamilyName[i]]
          )) as RowDataPacket[];
          if (rigfamilyRows.length > 0) {
            rigfamilyId.push(rigfamilyRows[0].id);
          } else {
            const [rigfamilyResult] = await conn.query(
              `INSERT INTO rigfamily (name, description) VALUES (?, ?)`,
              [rigfamilyName[i], rigfamilyDescription[i]]
            );
            rigfamilyId.push((rigfamilyResult as OkPacket).insertId);
          }
        }
      }

      // Insert new parameter
      const [parameterResult] = await conn.query(
        `INSERT INTO parameters (name, description, unit_id, datatype, decimals, min, max, comment, created_by, modified_by, creation_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newParameter.name,
          newParameter.description || null,
          unitId,
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
      if (rigfamilyId.length > 0) {
        rigfamilyId.forEach(async (rigfamilyId) => {
          await conn.query(
            `INSERT INTO parameter_rigfamily (parameter_id, rigfamily_id) VALUES (?, ?)`,
            [parameterId, rigfamilyId]
          );
        });
      }

      // Insert new images if any
      if (newParameter.images) {
        const urls = newParameter.images.url
          .split(";")
          .map((url) => url.trim());
        const names = newParameter.images.name
          ? newParameter.images.name.split(";").map((name) => name.trim())
          : Array(urls.length).fill(null);
        const descriptions = newParameter.images.description
          ? newParameter.images.description
              .split(";")
              .map((desc) => desc.trim())
          : Array(urls.length).fill(null);

        const images = urls.map((url, index) => ({
          url,
          name: names[index],
          description: descriptions[index],
        }));
        const imageValues = images.map(
          (image) =>
            `(${parameterId}, '${image.name}', '${image.description || ""}', '${
              image.url
            }')`
        );
        await conn.query(
          `INSERT INTO images (parameter_id, name, description, url) VALUES ${imageValues.join(
            ","
          )}`
        );
      }
    }

    await conn.commit();
    res.status(200).json({ message: "Parameters created successfully" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
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
    const parameter: NewParameter = req.body;
    console.log(parameter);

    // Update unit if exists else insert new unit
    let unitId = null;
    if (parameter.unit) {
      const [unitRows] = (await pool.query(
        `SELECT id FROM units WHERE name = ? LIMIT 1`,
        [parameter.unit.name]
      )) as RowDataPacket[];
      if (unitRows.length > 0) {
        unitId = unitRows[0].id;
      } else {
        const [unitResult] = await pool.query(
          `INSERT INTO units (name, description) VALUES (?, ?)`,
          [parameter.unit.name, parameter.unit.description || null]
        );
        unitId = (unitResult as OkPacket).insertId;
      }
    }
    console.log("unitID:", unitId);

    // Update rigfamily if exists else insert new rigfamily
    // Split rigfamily name and description into arrays using ; as separator and loop through them
    const rigfamilyId: number[] = [];
    if (parameter.rigfamily) {
      // Check if ; is present in rigfamily name
      var rigfamilyName = [];
      var rigfamilyDescription = [];
      if (parameter.rigfamily.name.includes(";")) {
        rigfamilyName = parameter.rigfamily.name.split(";");
        if (parameter.rigfamily.description) {
          rigfamilyDescription = parameter.rigfamily.description.split(";");
        } else {
          rigfamilyDescription = Array(rigfamilyName.length).fill("");
        }
      } else {
        rigfamilyName = [parameter.rigfamily.name];
        if (parameter.rigfamily.description) {
          rigfamilyDescription = [parameter.rigfamily.description];
        } else {
          rigfamilyDescription = [""];
        }
      }
      for (let i = 0; i < rigfamilyName.length; i++) {
        const [rigfamilyRows] = (await pool.query(
          `SELECT id FROM rigfamily WHERE name = ? LIMIT 1`,
          [rigfamilyName[i]]
        )) as RowDataPacket[];
        if (rigfamilyRows.length > 0) {
          rigfamilyId.push(rigfamilyRows[0].id);
        } else {
          const [rigfamilyResult] = await pool.query(
            `INSERT INTO rigfamily (name, description) VALUES (?, ?)`,
            [rigfamilyName[i], rigfamilyDescription[i]]
          );
          rigfamilyId.push((rigfamilyResult as OkPacket).insertId);
        }
      }
    }
    console.log("rigfamilyID:", rigfamilyId);

    // Update Images if any else insert new images
    if (parameter.images) {
      var urls = [];
      var names = [];
      var descriptions = [];
      //check if ; is present in the url string
      if (parameter.images.url.includes(";")) {
        urls = parameter.images.url.split(";").map((url) => url.trim());
        names = parameter.images.name
          ? parameter.images.name.split(";").map((name) => name.trim())
          : Array(urls.length).fill(null);
        descriptions = parameter.images.description
          ? parameter.images.description.split(";").map((desc) => desc.trim())
          : Array(urls.length).fill(null);
      } else {
        urls.push(parameter.images.url);
        names.push(parameter.images.name);
        descriptions.push(parameter.images.description);
      }

      const images = urls.map((url, index) => ({
        url,
        name: names[index],
        description: descriptions[index],
      }));
      console.log("images:", images);
      //Delete existing images for the parameter and insert new images
      await pool.query(`DELETE FROM images WHERE parameter_id = ?`, [
        req.params.id,
      ]);
      // Loop through images array and insert into images table
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          `INSERT INTO images (parameter_id, name, description, url) VALUES (?, ?, ?, ?)`,
          [
            req.params.id,
            images[i].name,
            images[i].description || null,
            images[i].url,
          ]
        );
      }
    }

    // Update parameter
    const [rows, fields] = await pool.query(
      `UPDATE parameters SET name = ? , description = ? , unit_id = ? , datatype = ? , decimals = ? , min = ? , max = ? , creation_date = ? , modified_date = ? , comment = ? , created_by = ?, modified_by = ? WHERE id = ?`,
      [
        parameter.name,
        parameter.description || null,
        unitId,
        parameter.datatype || null,
        parameter.decimals || null,
        parameter.min || null,
        parameter.max || null,
        new Date(parameter.creation_date) || null,
        new Date(parameter.modified_date) || null,
        parameter.comment || null,
        parameter.created_by || null,
        parameter.modified_by || null,
        req.params.id,
      ]
    );

    // Delete existing parameter_rigfamily and insert new parameter_rigfamily by looping through rigfamilyId array
    await pool.query(`DELETE FROM parameter_rigfamily WHERE parameter_id = ?`, [
      req.params.id,
    ]);
    for (let i = 0; i < rigfamilyId.length; i++) {
      await pool.query(
        `INSERT INTO parameter_rigfamily (parameter_id, rigfamily_id) VALUES (?, ?)`,
        [req.params.id, rigfamilyId[i]]
      );
    }

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
