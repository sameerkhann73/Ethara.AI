import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();
const controller = new TaskController();

// All routes protected
router.use(authenticateUser);

router.post('/', controller.create.bind(controller)); // .bind needed if class methods use 'this' but aren't arrow funcs
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getOne.bind(controller));
router.patch('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
