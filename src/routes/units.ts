import { Router } from 'express';
import controller  from '../controllers/units';
const router = Router();

/**
 * @swagger
 * /units:
 *   get:
 *     summary: Get all units
 *     description: Returns a list of all units
 *     responses:
 *       200:
 *         description: A list of units
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *     tags:
 *       - Units
 */

router.get('/', controller.getUnits);

export default router;
