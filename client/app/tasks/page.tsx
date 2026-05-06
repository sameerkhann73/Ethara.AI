'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Navbar } from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';
import { CreateTaskDialog } from '@/components/Tasks/CreateTaskDialog';
import { EditTaskDialog } from '@/components/Tasks/EditTaskDialog';
// import { TaskList } from '@/components/Dashboard/TaskList'; // Create this next

export default function Tasks() {
    const { user, loading } = useAuth();
    const [filters, setFilters] = useState({ status: '', priority: '' });
    const { data: tasks, isLoading, error } = useTasks(filters);
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    // Real-time listener
    useEffect(() => {
        if (!socket) return;

        const handleTaskUpdate = () => {
            console.log('Task updated, invalidating queries');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        };

        socket.on('task:created', handleTaskUpdate);
        socket.on('task:updated', handleTaskUpdate);
        socket.on('task:deleted', handleTaskUpdate);

        return () => {
            socket.off('task:created', handleTaskUpdate);
            socket.off('task:updated', handleTaskUpdate);
            socket.off('task:deleted', handleTaskUpdate);
        };
    }, [socket, queryClient]);

    const router = useRouter();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Sidebar />
            <main className="pt-20 lg:pl-[270px] pr-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">My Tasks</h1>
                    <CreateTaskDialog />
                </div>

                {/* Filters UI */}
                <div className="flex gap-4 mb-6">
                    <select
                        className="border p-2 rounded"
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <select
                        className="border p-2 rounded"
                        value={filters.priority}
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                </div>

                {isLoading ? (
                    <div>Loading tasks...</div>
                ) : error ? (
                    <div>Error loading tasks</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasks?.map((task: any) => (
                            <div key={task.id} className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <div className="flex gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full border ${task.priority === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                                            {task.priority}
                                        </span>
                                        <EditTaskDialog task={task} />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>{task.status}</span>
                                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
