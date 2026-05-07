'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Folder, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-gray-50 lg:block dark:bg-gray-900 h-screen w-[250px] fixed left-0 top-0 pt-16">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex-1 py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className={cn(
                                "flex items-center gap-3 rounded px-3 py-2 font-medium",
                                pathname === "/dashboard" ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"
                            )}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/tasks"
                            className={cn(
                                "flex items-center gap-3 rounded px-3 py-2 font-medium",
                                pathname === "/tasks" ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"
                            )}
                        >
                            <CheckSquare className="h-4 w-4" />
                            My Tasks
                        </Link>
                        <Link
                            href="/projects"
                            className={cn(
                                "flex items-center gap-3 rounded px-3 py-2 font-medium",
                                pathname.startsWith("/projects") ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"
                            )}
                        >
                            <Folder className="h-4 w-4" />
                            Projects
                        </Link>
                        <Link
                            href="/profile"
                            className={cn(
                                "flex items-center gap-3 rounded px-3 py-2 font-medium",
                                pathname === "/profile" ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"
                            )}
                        >
                            <UserCircle className="h-4 w-4" />
                            Profile
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
