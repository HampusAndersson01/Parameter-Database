import { Request, Response, NextFunction } from "express";
import { pool } from "..";
import { OkPacket, RowDataPacket } from "mysql2";


export const getRigFamilies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [rows, fields] = await pool.query(
        `SELECT * FROM rigfamily`
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  };

  export default {
    getRigFamilies
  };
  