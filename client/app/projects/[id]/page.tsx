'use client';

import { useProject, useDeleteProject } from '@/hooks/useProjects';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Navbar } from '@/components/Layout/Navbar';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Users, Clock } from 'lucide-react';
import { CreateTaskDialog } from '@/components/Tasks/CreateTaskDialog';
import { TaskList } from '@/components/Tasks/TaskList';
import { AddMemberDialog } from '@/components/Projects/AddMemberDialog';
import { EditProjectDialog } from '@/components/Projects/EditProjectDialog';
import { useAuth } from '@/hooks/useAuth';

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { data: project, isLoading, error } = useProject(id as string);
    const deleteProject = useDeleteProject();

    if (isLoading) return <div className="flex min-h-screen items-center justify-center text-slate-900 font-bold">Loading...</div>;
    if (error || !project) return <div className="p-8 text-center bg-red-50 text-red-500 rounded">Project not found or access denied</div>;

    const currentUserMember = project.project_members?.find((m: any) => m.user_id === user?.id);
    const isAdmin = currentUserMember?.role === 'ADMIN';

    const handleDelete = async () => {
        if (confirm('Delete this project?')) {
            await deleteProject.mutateAsync(project.id);
            router.push('/projects');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Sidebar />
            <main className="pt-20 lg:pl-[270px] pr-6 pb-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b pb-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">{project.name}</h1>
                            <p className="text-gray-500 text-sm font-medium">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                            {isAdmin && (
                                <>
                                    <EditProjectDialog project={project} />
                                    <Button variant="destructive" size="sm" onClick={handleDelete} className="font-bold">
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                </>
                            )}
                            <CreateTaskDialog projectId={project.id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Tasks ({project.tasks?.length || 0})</h2>
                            <TaskList tasks={project.tasks || []} isAdmin={isAdmin} currentUserId={user?.id} />
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> INFO
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">STATUS</span>
                                        <span className="text-sm font-bold text-slate-900">{project.status}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">PRIORITY</span>
                                        <span className="text-sm font-bold text-slate-900">{project.priority}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">DUE DATE</span>
                                        <span className="text-sm font-bold text-slate-900">{project.due_date ? new Date(project.due_date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <Users className="h-4 w-4" /> TEAM
                                    </h3>
                                    {isAdmin && <AddMemberDialog projectId={project.id} />}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.project_members?.map((member: any) => (
                                        <div key={member.user_id} className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-black shadow-sm" title={member.users?.name}>
                                            {member.users?.name?.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
