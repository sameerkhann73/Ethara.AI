'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
    dueDate: z.string().optional(),
    assignedTo: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
    defaultValues?: Partial<TaskFormValues>;
    onSubmit: (data: TaskFormValues) => void;
    isLoading?: boolean;
    users?: any[];
}

export function TaskForm({ defaultValues, onSubmit, isLoading, users }: TaskFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: 'MEDIUM',
            status: 'TODO',
            ...defaultValues
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register('description')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select id="priority" {...register('priority')} className="w-full border rounded-md p-2 h-10 bg-background">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" {...register('status')} className="w-full border rounded-md p-2 h-10 bg-background">
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <select id="assignedTo" {...register('assignedTo')} className="w-full border rounded-md p-2 h-10 bg-background">
                        <option value="">-- General (Unassigned) --</option>
                        {users?.map((u: any) => (
                            <option key={u.id} value={u.id}>
                                {u.name || u.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="datetime-local" {...register('dueDate')} />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Task'}</Button>
            </div>
        </form>
    );
}
