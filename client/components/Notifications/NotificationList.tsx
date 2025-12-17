'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
// If using popover
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';

export function NotificationList() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        console.log('[NotificationList] Fetching notifications for user:', user.id);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('[NotificationList] Error fetching notifications:', error);
        }

        if (data) {
            console.log('[NotificationList] Fetched notifications:', data);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (newNotification: any) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket.on('notification:new', handleNotification);
        return () => {
            socket.off('notification:new', handleNotification);
        };
    }, [socket]);

    const markAsRead = async () => {
        if (unreadCount === 0) return;
        if (!user) return;

        // Mark all showed as read
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);

        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <PopoverPrimitive.Root open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open) markAsRead();
        }}>
            <PopoverPrimitive.Trigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    className="z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                    align="end"
                >
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none mb-2">Notifications</h4>
                        {notifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No notifications</p>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                                {notifications.map(n => (
                                    <div key={n.id} className={cn("text-sm p-2 rounded bg-muted/50", !n.read && "bg-muted font-medium")}>
                                        <p>{n.message}</p>
                                        <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleTimeString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
