//image routes

import { Router } from 'express';
import { createImage, deleteImage, getImageById, getImages, updateImage } from '../controllers/image';

const router = Router();

// GET /images
router.get('/', getImages);

// GET /images/:id
router.get('/:id', getImageById);

// POST /images
router.post('/', createImage);

// PUT /images/:id
router.put('/:id', updateImage);

// DELETE /images/:id
router.delete('/:id', deleteImage);

export default router;