import { Router } from 'express';
import controller  from '../controllers/rigfamilies';
const router = Router();

/**
 * @swagger
 * /rigfamilies:
 *   get:
 *     summary: Get all rig families
 *     description: Returns a list of all rig families
 *     responses:
 *       200:
 *         description: A list of rig families
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RigFamily'
 *     tags:
 *       - Rig Families
 */

router.get('/', controller.getRigFamilies);

export default router;
