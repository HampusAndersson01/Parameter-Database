//sensor controller
import { Request, Response } from 'express';
import { pool } from '../index';
import { Sensor } from '../models/sensor';

export const getSensors = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sensors');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSensorById = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sensors WHERE id = ?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(404).json({ message: 'Sensor not found' });
    }
};  

export const createSensor = async (req: Request, res: Response) => {
    const sensor = new Sensor(req.body);

    try {
        // create a new sensor
        await pool.query('INSERT INTO sensors (name, supplier, datasheet, link_to_calibration, type) VALUES (?, ?, ?, ?, ?)', [sensor.name, sensor.supplier, sensor.datasheet, sensor.link_to_calibration, sensor.type]);
        
        res.status(201).json(sensor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSensor = async (req: Request, res: Response) => {
    try {
        const sensor = await pool.query('UPDATE sensors SET ? WHERE id = ?', [req.body, req.params.id]);

        if (sensor) {
            res.status(200).json(sensor);
        } else {
            res.status(404).json({ message: 'Sensor not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSensor = async (req: Request, res: Response) => {
    try {
        const sensor = await pool.query('DELETE FROM sensors WHERE id = ?', [req.params.id]);

        if (sensor) {
            res.status(200).json({ message: 'Sensor deleted' });
        } else {
            res.status(404).json({ message: 'Sensor not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

