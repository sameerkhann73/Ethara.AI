import { z } from 'zod';

export const CreateProjectSchema = z.object({
    name: z.string().min(3).max(100),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    due_date: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const AddProjectMemberSchema = z.object({
    userId: z.string().uuid(),
    role: z.enum(['ADMIN', 'MEMBER'])
});

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export type AddProjectMemberDto = z.infer<typeof AddProjectMemberSchema>;
