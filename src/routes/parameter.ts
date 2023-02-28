import express from 'express';
import { createParameter, getParameterImagesById, createParameterImage ,deleteParameter, getParameterById, getParameters, updateParameter } from '../controllers/parameter';

const router = express.Router();

// GET /parameters
router.get('/', getParameters);

// GET /parameters/:id
router.get('/:id', getParameterById);

// GET /parameters/:id/images
router.get('/:id/images', getParameterImagesById);

// POST /parameters
router.post('/', createParameter);

//POST /parameters/images
router.post('/images', createParameterImage);

// PUT /parameters/:id
router.put('/:id', updateParameter);

// DELETE /parameters/:id
router.delete('/:id', deleteParameter);


export default router;
