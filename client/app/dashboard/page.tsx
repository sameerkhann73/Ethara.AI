'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Navbar } from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/button';
import { CreateTaskDialog } from '@/components/Tasks/CreateTaskDialog';
import { TaskList } from '@/components/Tasks/TaskList';
import Link from 'next/link';

export default function Dashboard() {
    const { user, loading } = useAuth();
    const { data: tasks, isLoading, error } = useTasks({});
    const router = useRouter();

    if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-900 font-bold">Loading dashboard...</div>;

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    const totalTasks = tasks?.length || 0;
    const todoTasks = tasks?.filter((t: any) => t.status === 'TODO').length || 0;
    const inProgressTasks = tasks?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0;
    const completedTasks = tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
    const overdueTasks = tasks?.filter((t: any) => {
        if (!t.due_date || t.status === 'COMPLETED') return false;
        return new Date(t.due_date) < new Date();
    }).length || 0;

    const recentTasks = tasks?.slice(0, 6) || [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Sidebar />
            <main className="pt-20 lg:pl-[270px] pr-6 pb-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">DASHBOARD</h1>
                    <CreateTaskDialog />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Tasks</div>
                        <div className="text-2xl font-black text-slate-900">{totalTasks}</div>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">To Do</div>
                        <div className="text-2xl font-black text-slate-700">{todoTasks}</div>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">In Progress</div>
                        <div className="text-2xl font-black text-blue-600">{inProgressTasks}</div>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Completed</div>
                        <div className="text-2xl font-black text-green-600">{completedTasks}</div>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Overdue</div>
                        <div className="text-2xl font-black text-red-600">{overdueTasks}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Recent Tasks</h2>
                    <Button variant="link" asChild className="p-0 h-auto font-bold text-blue-600">
                        <Link href="/tasks">View All Tasks</Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-sm text-gray-400 italic">Loading tasks...</div>
                ) : error ? (
                    <div className="text-sm text-red-500 font-bold">Error loading tasks</div>
                ) : (
                    <TaskList tasks={recentTasks} currentUserId={user.id} />
                )}
            </main>
        </div>
    );
}
