//Controller for units
import { Request, Response } from 'express';
import { pool } from '../index';
import { Unit } from '../models/unit';

export const getUnits = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM units');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

export const getUnitById = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM units WHERE id = ?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(404).json({ message: 'Unit not found' });
    }
};

export const createUnit = async (req: Request, res: Response) => {
    const unit = new Unit(req.body);

    try {
        // create a new unit
        await pool.query('INSERT INTO units (name, description) VALUES (?, ?)', [unit.name, unit.description]);
        
        res.status(201).json(unit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateUnit = async (req: Request, res: Response) => {
    try {
        const unit = await pool.query('UPDATE units SET ? WHERE id = ?', [req.body, req.params.id]);

        if (unit) {
            res.status(200).json(unit);
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUnit = async (req: Request, res: Response) => {
    try {
        const unit = await pool.query('DELETE FROM units WHERE id = ?', [req.params.id]);

        if (unit) {
            res.status(200).json({ message: 'Unit deleted' });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

