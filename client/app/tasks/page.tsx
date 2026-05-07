'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Navbar } from '@/components/Layout/Navbar';
import { CreateTaskDialog } from '@/components/Tasks/CreateTaskDialog';
import { TaskList } from '@/components/Tasks/TaskList';

export default function Tasks() {
    const { user, loading } = useAuth();
    const [filters, setFilters] = useState({ status: '', priority: '' });
    
    const { data: tasks, isLoading, error } = useTasks({ 
        ...filters, 
        assignedToId: user?.id 
    });
    
    const router = useRouter();

    if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-900 font-bold">Loading tasks...</div>;

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Sidebar />
            <main className="pt-20 lg:pl-[270px] pr-6 pb-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">MY TASKS</h1>
                </div>

                <p className="text-gray-500 font-bold mb-6 uppercase text-[10px] tracking-widest bg-gray-50 p-2 border rounded inline-block">
                    Showing tasks assigned specifically to you
                </p>

                {/* Filters UI */}
                <div className="flex gap-4 mb-10">
                    <select
                        className="border-2 border-gray-200 p-2 rounded bg-white text-slate-900 font-bold text-sm outline-none focus:border-blue-500"
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">ALL STATUS</option>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                    <select
                        className="border-2 border-gray-200 p-2 rounded bg-white text-slate-900 font-bold text-sm outline-none focus:border-blue-500"
                        value={filters.priority}
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="">ALL PRIORITIES</option>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12 text-gray-400 font-bold italic tracking-widest">LOADING...</div>
                ) : error ? (
                    <div className="text-red-500 text-center py-12 font-bold">Error loading tasks. Please try again.</div>
                ) : (
                    <TaskList tasks={tasks} currentUserId={user.id} />
                )}
            </main>
        </div>
    );
}
