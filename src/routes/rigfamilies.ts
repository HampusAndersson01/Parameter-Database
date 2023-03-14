import { Router } from 'express';
import controller  from '../controllers/rigfamilies';
const router = Router();

router.get('/', controller.getRigFamilies);

export default router;
