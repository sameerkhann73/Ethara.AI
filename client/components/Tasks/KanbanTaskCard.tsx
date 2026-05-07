'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { TaskDetailDialog } from './TaskDetailDialog';
import { cn } from '@/lib/utils';

interface KanbanTaskCardProps {
    task: any;
    isAdmin: boolean;
    isOverlay?: boolean;
}

export function KanbanTaskCard({ task, isAdmin, isOverlay }: KanbanTaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-600 text-white';
            case 'HIGH': return 'bg-orange-600 text-white';
            case 'MEDIUM': return 'bg-yellow-500 text-black';
            default: return 'bg-green-600 text-white';
        }
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 bg-gray-200 dark:bg-gray-700 h-[120px] border-4 border-dashed border-gray-900 dark:border-white"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative p-5 border-4 bg-card cursor-grab active:cursor-grabbing border-gray-900 dark:border-white shadow-none rounded-none",
                isOverlay && "bg-gray-100 dark:bg-gray-800 scale-105 z-50 border-primary"
            )}
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className={cn("w-3 h-8 border-2 border-gray-900 dark:border-white", getPriorityColor(task.priority))} />
                    <TaskDetailDialog 
                        task={task} 
                        isAdmin={isAdmin} 
                        trigger={
                            <div className="text-[10px] text-gray-900 dark:text-white font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer border-2 px-2 py-1 border-gray-900 dark:border-white">
                                OPEN
                            </div>
                        }
                    />
                </div>
                
                <h4 className="font-black text-base text-gray-900 dark:text-white uppercase leading-none italic tracking-tight">
                    {task.title}
                </h4>
                
                {task.due_date && (
                    <div className="text-[10px] text-gray-900 dark:text-white font-black bg-gray-100 dark:bg-gray-800 px-2 py-1 border-2 border-gray-900 dark:border-white inline-block w-fit">
                        DUE: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
}
