//Router units
import express from 'express';
import { createUnit, deleteUnit, getUnitById, getUnits, updateUnit } from '../controllers/units';

const router = express.Router();

// GET /units
router.get('/', getUnits);

// GET /units/:id
router.get('/:id', getUnitById);

// POST /units
router.post('/', createUnit);

// PUT /units/:id
router.put('/:id', updateUnit);

// DELETE /units/:id
router.delete('/:id', deleteUnit);

export default router;

