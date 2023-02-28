import { Request, Response } from 'express';
import { Parameter } from '../models/parameter';
import { ParameterImage } from '../models/parameter_images';
import {pool} from '../index';

export const createParameter = async (req: Request, res: Response) => {
  const parameter = new Parameter(req.body);

  try {
    // create a new parameter
    await pool.query('INSERT INTO parameters (name, description, unit_id, datatype, decimals, min, max, creation_date, modified_date, rigfamily_id, comment, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [parameter.name, parameter.description, parameter.unit_id, parameter.datatype, parameter.decimals, parameter.min, parameter.max, parameter.creation_date, parameter.modified_date, parameter.rigfamily_id, parameter.comment, parameter.created_by, parameter.modified_by]);
    
    res.status(201).json(parameter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getParameters = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parameters');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getParameterById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parameters WHERE id = ?', [req.params.id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(404).json({ message: 'Parameter not found' });
  }
};


export const updateParameter = async (req: Request, res: Response) => {
  try {
    const parameter = await pool.query('UPDATE parameters SET ? WHERE id = ?', [req.body, req.params.id]);

    if (parameter) {
      res.status(200).json(parameter);
    } else {
      res.status(404).json({ message: 'Parameter not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteParameter = async (req: Request, res: Response) => {
  try {
    const parameter = await pool.query('DELETE FROM parameters WHERE id = ?', [req.params.id]);

    if (parameter) {
      res.status(200).json({ message: 'Parameter deleted' });
    } else {
      res.status(404).json({ message: 'Parameter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//imageslist

export const getParameterImagesById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parameter_images WHERE parameter_id = ?', [req.params.id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(404).json({ message: 'Parameter not found' });
  }
};

export const createParameterImage = async (req: Request, res: Response) => {
  const parameter_images = new ParameterImage(req.body);

  try {
    // create a new parameter
    await pool.query('INSERT INTO parameter_images (parameter_id, image_id) VALUES (?, ?)', [parameter_images.parameter_id, parameter_images.image_id]);
    
    res.status(201).json(parameter_images);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
