import { Request, Response, NextFunction } from "express";
import { pool } from "..";

export const getUnits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * FROM units`);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export default {
  getUnits,
};
