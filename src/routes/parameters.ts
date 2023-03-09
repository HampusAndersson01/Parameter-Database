/** source/routes/posts.ts */
import { Router } from 'express';
import controller  from '../controllers/parameters';
const router = Router();

router.get('/', controller.getParameters);
router.get('/:id', controller.getParameter);
router.post('/', controller.createParameters);
router.put('/:id', controller.updateParameter);
router.delete('/:id', controller.deleteParameter);

export default router;
