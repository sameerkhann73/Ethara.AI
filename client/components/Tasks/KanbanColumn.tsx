'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanTaskCard } from './KanbanTaskCard';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: any[];
    isAdmin: boolean;
}

export function KanbanColumn({ id, title, tasks, isAdmin }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col gap-4 bg-gray-100/50 dark:bg-gray-800/50 p-4 rounded-xl w-[300px] min-w-[300px] border"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {title}
                </h3>
                <Badge variant="secondary" className="rounded-md">
                    {tasks.length}
                </Badge>
            </div>

            <div className="flex flex-col gap-3 flex-1">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <KanbanTaskCard key={task.id} task={task} isAdmin={isAdmin} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
