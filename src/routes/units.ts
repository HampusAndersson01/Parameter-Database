import { Router } from 'express';
import controller  from '../controllers/units';
const router = Router();

router.get('/', controller.getUnits);

export default router;
