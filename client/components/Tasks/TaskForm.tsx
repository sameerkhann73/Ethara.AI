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
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
    dueDate: z.string().optional(),
    assignedToId: z.string().optional(),
    tags: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
    defaultValues?: Partial<TaskFormValues>;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
    users?: any[];
}

export function TaskForm({ defaultValues, onSubmit, isLoading, users }: TaskFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: 'MEDIUM',
            status: 'TODO',
            ...defaultValues,
            tags: Array.isArray(defaultValues?.tags) ? (defaultValues.tags as string[]).join(', ') : (defaultValues?.tags as string || '')
        },
    });

    const handleFormSubmit = (values: TaskFormValues) => {
        const tagsArray = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        onSubmit({ ...values, tags: tagsArray });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="title" className="text-sm">Title</Label>
                <Input id="title" {...register('title')} placeholder="Task title" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <textarea 
                    id="description" 
                    {...register('description')} 
                    rows={2}
                    className="flex w-full rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="priority" className="text-sm">Priority</Label>
                    <select id="priority" {...register('priority')} className="w-full border rounded p-2 bg-background text-sm">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="status" className="text-sm">Status</Label>
                    <select id="status" {...register('status')} className="w-full border rounded p-2 bg-background text-sm">
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="assignedToId" className="text-sm">Assign To</Label>
                    <select id="assignedToId" {...register('assignedToId')} className="w-full border rounded p-2 bg-background text-sm">
                        <option value="">Unassigned</option>
                        {users?.map((u: any) => (
                            <option key={u.user_id} value={u.user_id}>
                                {u.users?.name || u.users?.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="dueDate" className="text-sm">Due Date</Label>
                    <Input id="dueDate" type="datetime-local" {...register('dueDate')} />
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="tags" className="text-sm">Tags</Label>
                <Input id="tags" {...register('tags')} placeholder="e.g. bug, high-priority" />
            </div>

            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}
