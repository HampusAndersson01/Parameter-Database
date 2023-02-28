//sensor routes

import { Router } from 'express';
import { createSensor, deleteSensor, getSensorById, getSensors, updateSensor } from '../controllers/sensor';

const router = Router();

// GET /sensors
router.get('/', getSensors);

// GET /sensors/:id
router.get('/:id', getSensorById);

// POST /sensors
router.post('/', createSensor);

// PUT /sensors/:id
router.put('/:id', updateSensor);

// DELETE /sensors/:id
router.delete('/:id', deleteSensor);

export default router;
