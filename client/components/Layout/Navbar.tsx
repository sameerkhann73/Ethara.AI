'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '../ThemeToggle';

export function Navbar() {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b bg-white/80 px-6 lg:h-[60px] dark:bg-gray-950/80 backdrop-blur-md">
            <Link className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white" href="/dashboard">
                <span>Ethara.Ai</span>
            </Link>
            <div className="w-full flex-1">
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        </header>
    );
}
