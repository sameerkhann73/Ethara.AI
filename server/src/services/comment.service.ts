import { CommentRepository } from '../repositories/comment.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { TaskRepository } from '../repositories/task.repository';
import { CreateCommentDto } from '../dtos/comment.dto';

export class CommentService {
    private commentRepo: CommentRepository;
    private projectRepo: ProjectRepository;
    private taskRepo: TaskRepository;

    constructor() {
        this.commentRepo = new CommentRepository();
        this.projectRepo = new ProjectRepository();
        this.taskRepo = new TaskRepository();
    }

    async addComment(userId: string, taskId: string, data: CreateCommentDto) {
        // Check if user has access to the task (must be project member)
        const task = await this.taskRepo.findById(taskId);
        if (!task) throw new Error('Task not found');

        const role = await this.projectRepo.checkRole(task.project_id, userId);
        if (!role) throw new Error('Forbidden: You are not a member of this project');

        return this.commentRepo.create({
            task_id: taskId,
            user_id: userId,
            content: data.content
        });
    }

    async getTaskComments(userId: string, taskId: string) {
        // Check access
        const task = await this.taskRepo.findById(taskId);
        if (!task) throw new Error('Task not found');

        const role = await this.projectRepo.checkRole(task.project_id, userId);
        if (!role) throw new Error('Forbidden: You are not a member of this project');

        return this.commentRepo.findByTaskId(taskId);
    }

    async deleteComment(userId: string, commentId: string) {
        return this.commentRepo.delete(commentId, userId);
    }
}
