'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from '../ui/button';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { NotificationList } from '../Notifications/NotificationList';

export function Navbar() {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 lg:h-[60px] dark:bg-gray-800/40 backdrop-blur-md">
            <Link className="flex items-center gap-2 font-semibold" href="#">
                <span className="">Task Manager</span>
            </Link>
            <div className="w-full flex-1">
                {/* Search or other items */}
            </div>
            <div className="flex items-center gap-4">
                <NotificationList />
                <Link href="/profile">
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Go to profile</span>
                    </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        </header>
    );
}
