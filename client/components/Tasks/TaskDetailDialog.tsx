'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskForm } from './TaskForm';
import { CommentSection } from './CommentSection';
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Pencil, Trash2, Calendar, Layout, User, MoreHorizontal, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface TaskDetailDialogProps {
    task: any;
    isAdmin: boolean;
    trigger?: React.ReactNode;
}

export function TaskDetailDialog({ task, isAdmin, trigger }: TaskDetailDialogProps) {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuth();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const handleUpdate = async (data: any) => {
        try {
            await updateTask.mutateAsync({ id: task.id, updates: data });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDelete = async () => {
        if (confirm('Delete this task?')) {
            await deleteTask.mutateAsync(task.id);
            setOpen(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-blue-500" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'HIGH': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setIsEditing(false); }}>
            <DialogTrigger asChild>
                {trigger || <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between pr-8">
                    <div className="space-y-1">
                        <DialogTitle className="text-xl">{isEditing ? 'Edit Task' : task.title}</DialogTitle>
                        {!isEditing && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    {getStatusIcon(task.status)}
                                    {task.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={cn("border-none", getPriorityColor(task.priority))}>
                                    {task.priority}
                                </Badge>
                            </div>
                        )}
                    </div>
                    {!isEditing && isAdmin && (
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </DialogHeader>

                {isEditing ? (
                    <div className="pt-4">
                        <TaskForm
                            defaultValues={{
                                title: task.title,
                                description: task.description,
                                priority: task.priority,
                                status: task.status,
                                dueDate: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ''
                            }}
                            onSubmit={handleUpdate}
                            isLoading={updateTask.isPending}
                        />
                        <Button variant="ghost" className="mt-2 w-full" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                ) : (
                    <div className="space-y-6 pt-4">
                        {/* Description */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Description</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border">
                                {task.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Due Date</h4>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {task.due_date ? new Date(task.due_date).toLocaleString() : 'No deadline'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Assigned To</h4>
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-gray-400" />
                                    {task.assigned_to_id === user?.id ? 'You' : 'Team Member'}
                                </div>
                            </div>
                        </div>

                        {/* Comment Section */}
                        <CommentSection taskId={task.id} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
