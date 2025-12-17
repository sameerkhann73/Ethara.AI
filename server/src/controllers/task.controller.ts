import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskSchema, UpdateTaskSchema } from '../dtos/task.dto';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const taskService = new TaskService();

export class TaskController {
    async create(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const validated = CreateTaskSchema.parse(req.body);
            const task = await taskService.createTask(user.id, validated);
            res.status(201).json(task);
        } catch (error: any) {
            if (error.issues) return res.status(400).json({ error: error.issues });
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const filters = req.query;
            const tasks = await taskService.getTasks(user.id, filters);
            res.json(tasks);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const task = await taskService.getTaskById(id);
            res.json(task);
        } catch (error: any) {
            res.status(404).json({ error: 'Task not found' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.params;
            const validated = UpdateTaskSchema.parse(req.body);
            const task = await taskService.updateTask(id, validated, user.id);
            res.json(task);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.params;
            await taskService.deleteTask(id, user.id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
