import { z } from 'zod';

export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(), // Expects ISO string
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).default('TODO'),
    assignedToId: z.string().uuid().nullable().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
