import { z } from 'zod';

export const CreateTaskSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
    dueDate: z.string().optional().nullable(),
    assignedToId: z.string().optional().nullable(),
    projectId: z.string().uuid(),
    tags: z.array(z.string()).optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().omit({ projectId: true });

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
