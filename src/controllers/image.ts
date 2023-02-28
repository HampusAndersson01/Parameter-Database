//image controller
import { Request, Response } from 'express';
import { pool } from '../index';
import { Image } from '../models/image';

export const getImages = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM images');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getImageById = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM images WHERE id = ?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(404).json({ message: 'Image not found' });
    }
};

export const createImage = async (req: Request, res: Response) => {
    const image = new Image(req.body);

    try {
        // create a new image
        await pool.query('INSERT INTO images (name, description, link) VALUES (?, ?, ?)', [image.name, image.description, image.link]);
        
        res.status(201).json(image);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateImage = async (req: Request, res: Response) => {
    try {
        const image = await pool.query('UPDATE images SET ? WHERE id = ?', [req.body, req.params.id]);

        if (image) {
            res.status(200).json(image);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteImage = async (req: Request, res: Response) => {
    try {
        const image = await pool.query('DELETE FROM images WHERE id = ?', [req.params.id]);

        if (image) {
            res.status(200).json({ message: 'Image deleted' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


