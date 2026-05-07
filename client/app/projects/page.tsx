'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Navbar } from '@/components/Layout/Navbar';
import { CreateProjectDialog } from '@/components/Projects/CreateProjectDialog';
import Link from 'next/link';

export default function Projects() {
    const { user, loading } = useAuth();
    const { data: projects, isLoading, error } = useProjects();
    const router = useRouter();

    if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-900 font-bold">Loading projects...</div>;

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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">PROJECTS</h1>
                    <CreateProjectDialog />
                </div>

                {isLoading ? (
                    <div className="text-gray-500 font-bold">Loading projects...</div>
                ) : error ? (
                    <div className="text-red-500 font-bold">Error loading projects</div>
                ) : projects?.length === 0 ? (
                    <div className="text-gray-500 py-12 text-center border-2 border-dashed rounded-xl">No projects found. Create one to get started!</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects?.map((project: any) => (
                            <Link href={`/projects/${project.id}`} key={project.id}>
                                <div className="p-6 border border-gray-200 rounded-lg bg-white cursor-pointer h-full flex flex-col shadow-sm transition-colors hover:border-blue-500">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-xl text-slate-900">{project.name}</h3>
                                        <span className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-700 border font-bold uppercase tracking-wider">
                                            {project.project_members?.[0]?.role || 'MEMBER'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-6 line-clamp-2">{project.description || 'No description provided'}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <span>CREATED</span>
                                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
