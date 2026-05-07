import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { CommentController } from '../controllers/comment.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();
const commentController = new CommentController();

// All routes protected
router.use(authenticateUser);

router.post('/', taskController.create.bind(taskController));
router.get('/', taskController.getAll.bind(taskController));
router.get('/:id', taskController.getOne.bind(taskController));
router.patch('/:id', taskController.update.bind(taskController));
router.delete('/:id', taskController.delete.bind(taskController));

// Sub-resource: Comments
router.post('/:taskId/comments', commentController.create.bind(commentController));
router.get('/:taskId/comments', commentController.getByTask.bind(commentController));
router.delete('/comments/:id', commentController.delete.bind(commentController));

export default router;
