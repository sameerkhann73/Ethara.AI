import { TaskRepository } from '../repositories/task.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

export class TaskService {
    private repository: TaskRepository;
    private projectRepository: ProjectRepository;

    constructor() {
        this.repository = new TaskRepository();
        this.projectRepository = new ProjectRepository();
    }

    async createTask(userId: string, data: CreateTaskDto) {
        // RBAC: Only Admin of the project can create tasks
        const role = await this.projectRepository.checkRole(data.projectId, userId);
        if (role !== 'ADMIN') throw new Error('Forbidden: Only ADMIN can create tasks');

        const task = await this.repository.create({ ...data, creatorId: userId });
        return task;
    }

    async getTasks(userId: string, filters: any) {
        return this.repository.findAll(filters);
    }

    async getTaskById(id: string) {
        return this.repository.findById(id);
    }

    async updateTask(id: string, data: UpdateTaskDto, userId: string) {
        const task = await this.repository.findById(id);
        if (!task) throw new Error('Task not found');

        const role = await this.projectRepository.checkRole(task.project_id, userId);
        
        // Admin: Full access
        if (role === 'ADMIN') {
            return this.repository.update(id, data);
        }

        // Member: Only if assigned and only status
        if (role === 'MEMBER') {
            if (task.assigned_to_id !== userId) {
                throw new Error('Forbidden: You can only update tasks assigned to you');
            }

            // Restrict updates to status only
            const statusOnlyUpdate = { status: data.status };
            return this.repository.update(id, statusOnlyUpdate);
        }

        throw new Error('Forbidden: You do not have permission to update this task');
    }

    async deleteTask(id: string, userId: string) {
        const task = await this.repository.findById(id);
        if (!task) throw new Error('Task not found');

        const role = await this.projectRepository.checkRole(task.project_id, userId);
        if (role !== 'ADMIN') throw new Error('Forbidden: Only ADMIN can delete tasks');

        await this.repository.delete(id);
        return { success: true };
    }
}
