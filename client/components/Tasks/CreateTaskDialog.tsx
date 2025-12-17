'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TaskForm } from './TaskForm';
import { useCreateTask } from '@/hooks/useTasks';
import { useAllUsers } from '@/hooks/useUser';

export function CreateTaskDialog() {
    const [open, setOpen] = useState(false);
    const createTaskMutation = useCreateTask();
    const { data: users } = useAllUsers();

    const handleSubmit = async (data: any) => {
        console.log('[CreateTaskDialog] Raw Form Data:', data);
        // Ensure dueDate is ISO if present
        const payload = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
            assignedToId: data.assignedTo || null
        };

        console.log('[CreateTaskDialog] Payload to Server:', payload);

        await createTaskMutation.mutateAsync(payload);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <TaskForm onSubmit={handleSubmit} isLoading={createTaskMutation.isPending} users={users} />
            </DialogContent>
        </Dialog>
    );
}
