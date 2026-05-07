'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TaskForm } from './TaskForm';
import { useCreateTask } from '@/hooks/useTasks';
import { useProject } from '@/hooks/useProjects';
import { Plus } from 'lucide-react';

export function CreateTaskDialog({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false);
    const createTaskMutation = useCreateTask();
    const { data: project } = useProject(projectId);

    const handleSubmit = async (data: any) => {
        const payload = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
            projectId: projectId
        };

        await createTaskMutation.mutateAsync(payload);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <TaskForm 
                    onSubmit={handleSubmit} 
                    isLoading={createTaskMutation.isPending} 
                    users={project?.project_members || []} 
                />
            </DialogContent>
        </Dialog>
    );
}
