import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { CreateProjectSchema, UpdateProjectSchema, AddProjectMemberSchema } from '../dtos/project.dto';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const projectService = new ProjectService();

export class ProjectController {
    async create(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const validated = CreateProjectSchema.parse(req.body);
            const project = await projectService.createProject(user.id, validated);
            res.status(201).json(project);
        } catch (error: any) {
            if (error.issues) return res.status(400).json({ error: error.issues });
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.params;
            const validated = UpdateProjectSchema.parse(req.body);
            const project = await projectService.updateProject(user.id, id, validated);
            res.json(project);
        } catch (error: any) {
            if (error.issues) return res.status(400).json({ error: error.issues });
            if (error.message.includes('Forbidden')) return res.status(403).json({ error: error.message });
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.params;
            await projectService.deleteProject(user.id, id);
            res.json({ success: true });
        } catch (error: any) {
            if (error.message.includes('Forbidden')) return res.status(403).json({ error: error.message });
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const projects = await projectService.getProjects(user.id);
            res.json(projects);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.params;
            const project = await projectService.getProjectById(user.id, id);
            res.json(project);
        } catch (error: any) {
            if (error.message.includes('Forbidden')) return res.status(403).json({ error: error.message });
            res.status(404).json({ error: 'Project not found' });
        }
    }

    async addMember(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.params;
            const validated = AddProjectMemberSchema.parse(req.body);
            const member = await projectService.addMember(user.id, id, validated);
            res.status(201).json(member);
        } catch (error: any) {
            if (error.issues) return res.status(400).json({ error: error.issues });
            if (error.message.includes('Forbidden')) return res.status(403).json({ error: error.message });
            res.status(500).json({ error: error.message });
        }
    }

    async removeMember(req: Request, res: Response) {
        try {
            const user = (req as AuthenticatedRequest).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { id, userId } = req.params;
            await projectService.removeMember(user.id, id, userId);
            res.json({ success: true });
        } catch (error: any) {
            if (error.message.includes('Forbidden')) return res.status(403).json({ error: error.message });
            res.status(500).json({ error: error.message });
        }
    }
}
