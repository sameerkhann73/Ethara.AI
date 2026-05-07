import { z } from 'zod';

export const CreateCommentSchema = z.object({
    content: z.string().min(1).max(1000)
});

export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
