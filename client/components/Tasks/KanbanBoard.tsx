'use client';

import React, { useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import { useUpdateTask } from '@/hooks/useTasks';

const COLUMNS = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'COMPLETED', title: 'Completed' },
];

export function KanbanBoard({ tasks, isAdmin }: { tasks: any[], isAdmin: boolean }) {
    const [localTasks, setLocalTasks] = useState(tasks);
    const [activeTask, setActiveTask] = useState<any>(null);
    const updateTask = useUpdateTask();

    // Re-sync local tasks when props change
    useMemo(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveTask(localTasks.find((t) => t.id === active.id));
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = localTasks.some((t) => t.id === activeId);
        const isOverATask = localTasks.some((t) => t.id === overId);
        const isOverAColumn = COLUMNS.some((c) => c.id === overId);

        if (!isActiveATask) return;

        // Dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setLocalTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].status !== tasks[overIndex].status) {
                    tasks[activeIndex].status = tasks[overIndex].status;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        // Dropping a Task over a Column
        if (isActiveATask && isOverAColumn) {
            setLocalTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].status = overId as string;
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    };

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id as string;
        const newStatus = localTasks.find(t => t.id === taskId)?.status;

        if (newStatus && newStatus !== tasks.find(t => t.id === taskId)?.status) {
            try {
                await updateTask.mutateAsync({ id: taskId, updates: { status: newStatus } });
            } catch (error) {
                console.error('Failed to update task status:', error);
                setLocalTasks(tasks); // Rollback on error
            }
        }

        setActiveTask(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex gap-4 h-full min-h-[500px] overflow-x-auto pb-4">
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={localTasks.filter((t) => t.status === col.id)}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <KanbanTaskCard task={activeTask} isAdmin={isAdmin} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
