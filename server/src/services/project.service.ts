import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto } from '../dtos/project.dto';

export class ProjectService {
    private repository: ProjectRepository;

    constructor() {
        this.repository = new ProjectRepository();
    }

    async createProject(userId: string, data: CreateProjectDto) {
        const project = await this.repository.create({ ...data, created_by: userId });
        await this.repository.addMember(project.id, userId, 'ADMIN');
        return project;
    }

    async updateProject(userId: string, projectId: string, data: UpdateProjectDto) {
        const role = await this.repository.checkRole(projectId, userId);
        if (role !== 'ADMIN') throw new Error('Forbidden: Only ADMIN can update projects');

        return this.repository.update(projectId, data);
    }

    async deleteProject(userId: string, projectId: string) {
        const role = await this.repository.checkRole(projectId, userId);
        if (role !== 'ADMIN') throw new Error('Forbidden: Only ADMIN can delete projects');

        return this.repository.delete(projectId);
    }

    async getProjects(userId: string) {
        return this.repository.findUserProjects(userId);
    }

    async getProjectById(userId: string, projectId: string) {
        const role = await this.repository.checkRole(projectId, userId);
        if (!role) throw new Error('Forbidden: You are not a member of this project');

        return this.repository.findById(projectId);
    }

    async addMember(userId: string, projectId: string, data: AddProjectMemberDto) {
        const role = await this.repository.checkRole(projectId, userId);
        if (role !== 'ADMIN') throw new Error('Forbidden: Only ADMIN can add members');

        return this.repository.addMember(projectId, data.userId, data.role);
    }

    async removeMember(userId: string, projectId: string, memberIdToRemove: string) {
        const role = await this.repository.checkRole(projectId, userId);
        if (role !== 'ADMIN') throw new Error('Forbidden: Only ADMIN can remove members');

        return this.repository.removeMember(projectId, memberIdToRemove);
    }
}
