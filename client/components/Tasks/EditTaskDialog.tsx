'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TaskForm } from './TaskForm';
import { useUpdateTask } from '@/hooks/useTasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';

export function EditTaskDialog({ task }: { task: any }) {
    const [open, setOpen] = useState(false);
    const updateTaskMutation = useUpdateTask();

    const handleSubmit = async (data: any) => {
        const payload = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null
        };

        await updateTaskMutation.mutateAsync({ id: task.id, updates: payload });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                    defaultValues={{
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        status: task.status,
                        dueDate: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ''
                    }}
                    onSubmit={handleSubmit}
                    isLoading={updateTaskMutation.isPending}
                />
            </DialogContent>
        </Dialog>
    );
}
