'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 h-screen w-[250px] fixed left-0 top-0 pt-16">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex-1 py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                                pathname === "/dashboard" && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                            )}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/tasks"
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                                pathname === "/tasks" && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                            )}
                        >
                            <CheckSquare className="h-4 w-4" />
                            My Tasks
                        </Link>
                        <Link
                            href="/profile"
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                                pathname === "/profile" && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                            )}
                        >
                            <PlusCircle className="h-4 w-4" />
                            Profile
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
