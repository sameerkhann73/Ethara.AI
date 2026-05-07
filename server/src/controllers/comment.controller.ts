import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { CreateCommentSchema } from '../dtos/comment.dto';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const commentService = new CommentService();

export class CommentController {
    async create(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { taskId } = req.params;
            const validated = CreateCommentSchema.parse(req.body);
            const comment = await commentService.addComment(user.id, taskId, validated);
            res.status(201).json(comment);
        } catch (error: any) {
            if (error.issues) return res.status(400).json({ error: error.issues });
            if (error.message.includes('Forbidden')) return res.status(403).json({ error: error.message });
            res.status(500).json({ error: error.message });
        }
    }

    async getByTask(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { taskId } = req.params;
            const comments = await commentService.getTaskComments(user.id, taskId);
            res.json(comments);
        } catch (error: any) {
            if (error.message.includes('Forbidden')) return res.status(403).json({ error: error.message });
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.params;
            await commentService.deleteComment(user.id, id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
