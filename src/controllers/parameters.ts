import { Request, Response, NextFunction } from "express";
import { pool } from "..";
import { OkPacket, RowDataPacket } from "mysql2";
import { Parameters } from "../models/parameters";

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
      GROUP_CONCAT(DISTINCT img.name ORDER BY img.id ASC SEPARATOR ';') AS image_name, GROUP_CONCAT(DISTINCT img.description ORDER BY img.id ASC SEPARATOR ';') AS image_description, GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC SEPARATOR ';') AS image_urls,
      GROUP_CONCAT(DISTINCT pv.value ORDER BY pv.id ASC SEPARATOR ';') AS possible_values, GROUP_CONCAT(DISTINCT pv.description ORDER BY pv.id ASC SEPARATOR ';') AS possible_values_description
      FROM parameters p 
      LEFT JOIN units u ON p.unit_id = u.id 
      LEFT JOIN images img ON p.id = img.parameter_id 
      LEFT JOIN possible_values pv ON p.id = pv.parameter_id
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
      `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.datatype, 
        p.decimals, 
        p.min, 
        p.max, 
        p.creation_date, 
        p.modified_date, 
        p.created_by, 
        p.modified_by, 
        p.comment, 
        u.name AS unit_name, 
        u.description AS unit_description, 
        GROUP_CONCAT(DISTINCT rf.name ORDER BY rf.id ASC SEPARATOR ';') AS rigfamily_name,  
        GROUP_CONCAT(DISTINCT rf.description ORDER BY rf.id ASC SEPARATOR ';') AS rigfamily_description, 
        GROUP_CONCAT(img.name ORDER BY img.id ASC SEPARATOR ';') AS image_name, 
        GROUP_CONCAT(img.description ORDER BY img.id ASC SEPARATOR ';') AS image_description, 
        GROUP_CONCAT(img.url ORDER BY img.id ASC SEPARATOR ';') AS image_urls,
        GROUP_CONCAT(DISTINCT pv.value ORDER BY pv.id ASC SEPARATOR ';') AS possible_values, 
        GROUP_CONCAT(DISTINCT pv.description ORDER BY pv.id ASC SEPARATOR ';') AS possible_values_description
      FROM 
        parameters p 
        JOIN units u ON p.unit_id = u.id 
        JOIN (
          SELECT 
          parameter_id,
          GROUP_CONCAT(name ORDER BY id ASC SEPARATOR ';') AS name,
          GROUP_CONCAT(description ORDER BY id ASC SEPARATOR ';') AS description,
          GROUP_CONCAT(url ORDER BY id ASC SEPARATOR ';') AS url,
          GROUP_CONCAT(id ORDER BY id ASC SEPARATOR ';') AS id
          FROM images 
          GROUP BY parameter_id
        ) img ON p.id = img.parameter_id 
        JOIN possible_values pv ON p.id = pv.parameter_id
        JOIN parameter_rigfamily pr ON pr.parameter_id = p.id 
        JOIN rigfamily rf ON rf.id = pr.rigfamily_id
      WHERE 
        p.id = ?;
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

export const createParameters = async (req: Request, res: Response) => {
  const conn = await pool.getConnection();
  const newParameters: Parameters[] = req.body;
  console.log(newParameters);
  
  const duplicateParameters: string[] = [];

  try {
    await conn.beginTransaction();

    for (const newParameter of newParameters) {
      // If parameter name already exists, return error
      const [rows, fields] = await pool.query(
        `SELECT id FROM parameters WHERE name = ? LIMIT 1`,
        [newParameter.name]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        console.log("Parameter already exists");
        duplicateParameters.push(newParameter.name);
        continue;
      }

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
      if (
        newParameter.images &&
        newParameter.images.url !== null &&
        newParameter.images.url !== ""
      ) {
        let urls = [];
        let names = [];
        let descriptions = [];
        if (newParameter.images.url.includes(";")) {
          urls = newParameter.images.url.split(";").map((url) => url.trim());
          names = newParameter.images.name
            ? newParameter.images.name.split(";").map((name) => name.trim())
            : Array(urls.length).fill(null);
          descriptions = newParameter.images.description
            ? newParameter.images.description
                .split(";")
                .map((desc) => desc.trim())
            : Array(urls.length).fill(null);
        } else {
          urls = [newParameter.images.url];
          names = [newParameter.images.name || null];
          descriptions = [newParameter.images.description || null];
        }

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

      // Insert new possible values if any
      if (
        newParameter.possible_values &&
        newParameter.possible_values.value !== null &&
        newParameter.possible_values.value !== ""
      ) {
        console.log(newParameter.possible_values);
        let values = [];
        let descriptions = [];
        if (newParameter.possible_values.value.includes(";")) {
          values = newParameter.possible_values.value
            .split(";")
            .map((value) => value.trim());
          descriptions = newParameter.possible_values.description
            ? newParameter.possible_values.description
                .split(";")
                .map((desc) => desc.trim())
            : Array(values.length).fill(null);
        } else {
          values = [newParameter.possible_values.value];
          descriptions = [newParameter.possible_values.description] || null;
        }
        console.log(values);

        const possibleValues = values.map((name, index) => ({
          value: name,
          description: descriptions[index],
        }));
        const possibleValuesNames = possibleValues.map(
          (possibleValue) =>
            `(${parameterId}, '${possibleValue.value}', '${
              possibleValue.description || ""
            }')`
        );
        await conn.query(
          `INSERT INTO possible_values (parameter_id, value, description) VALUES ${possibleValuesNames.join(
            ","
          )}`
        );
      }
    }

    await conn.commit();
    if (duplicateParameters.length === 0) {
      res.status(201).json({ message: "Parameters created successfully" });
    } else {
      res.status(201).json({
        message: "Some parameters already existed",
        duplicates: duplicateParameters,
      });
    }
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(501).json({ message: "Something went wrong" });
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
    const parameter: Parameters = req.body;
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
      var values = [];
      var descriptions = [];
      //check if ; is present in the url string
      if (parameter.images.url.includes(";")) {
        urls = parameter.images.url.split(";").map((url) => url.trim());
        values = parameter.images.name
          ? parameter.images.name.split(";").map((name) => name.trim())
          : Array(urls.length).fill(null);
        descriptions = parameter.images.description
          ? parameter.images.description.split(";").map((desc) => desc.trim())
          : Array(urls.length).fill(null);
      } else {
        urls.push(parameter.images.url);
        values.push(parameter.images.name);
        descriptions.push(parameter.images.description);
      }

      const images = urls.map((url, index) => ({
        url,
        name: values[index],
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

    // Update possible_values if any else insert new possible_values
    if (parameter.possible_values) {
      var values = [];
      var descriptions = [];
      //check if ; is present in the url string
      if (parameter.possible_values.value.includes(";")) {
        values = parameter.possible_values.value
          .split(";")
          .map((value) => value.trim());
        descriptions = parameter.possible_values.description
          ? parameter.possible_values.description
              .split(";")
              .map((desc) => desc.trim())
          : Array(values.length).fill(null);
      } else {
        values.push(parameter.possible_values.value);
        descriptions.push(parameter.possible_values.description);
      }

      const possible_values = values.map((value, index) => ({
        value,
        description: descriptions[index],
      }));
      console.log("possible_values:", possible_values);
      //Delete existing possible_values for the parameter and insert new possible_values
      await pool.query(`DELETE FROM possible_values WHERE parameter_id = ?`, [
        req.params.id,
      ]);
      // Loop through possible_values array and insert into possible_values table
      for (let i = 0; i < possible_values.length; i++) {
        await pool.query(
          `INSERT INTO possible_values (parameter_id, value, description) VALUES (?, ?, ?)`,
          [
            req.params.id,
            possible_values[i].value,
            possible_values[i].description,
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
    //FIXME: Cannot delete or update a parent row: a foreign key constraint fails (`parameter db`.`images`, CONSTRAINT `fk_images_parameters` FOREIGN KEY (`parameter_id`) REFERENCES `parameters` (`id`))

    // Delete images
    await pool.query(`DELETE FROM images WHERE parameter_id = ?`, [
      req.params.id,
    ]);
    // Delete possible_values
    await pool.query(`DELETE FROM possible_values WHERE parameter_id = ?`, [
      req.params.id,
    ]);
    // Delete parameter_rigfamily
    await pool.query(`DELETE FROM parameter_rigfamily WHERE parameter_id = ?`, [
      req.params.id,
    ]);
    // Delete parameter from parameter_rigfamily
    await pool.query("DELETE FROM parameter_rigfamily WHERE parameter_id = ?", [
      req.params.id,
    ]);
    // Delete rigfamily if no parameter is associated with it
    await pool.query(
      "DELETE FROM rigfamily WHERE id NOT IN (SELECT rigfamily_id FROM parameter_rigfamily)"
    );

    // Delete parameter
    const [rows, fields] = await pool.query(
      "DELETE FROM parameters WHERE id = ?",
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
