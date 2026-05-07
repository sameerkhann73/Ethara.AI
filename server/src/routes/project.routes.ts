import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();
const controller = new ProjectController();

router.use(authenticateUser);

router.post('/', controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getOne.bind(controller));
router.patch('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.post('/:id/members', controller.addMember.bind(controller));
router.delete('/:id/members/:userId', controller.removeMember.bind(controller));

export default router;
