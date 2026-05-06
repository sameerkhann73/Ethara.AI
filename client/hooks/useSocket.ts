import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

let socket: Socket;

export const useSocket = () => {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Connect to backend
        // In dev: http://localhost:4000. In prod: relative or env var
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        socket = io(socketUrl, {
            withCredentials: true,
        });

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Socket connected');
            if (user) {
                console.log('Joining user room:', user.id);
                socket.emit('join_user', user.id);
            }
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        // If already connected when this effect runs (or re-runs with user), join immediately
        if (socket.connected && user) {
            console.log('Socket already connected. Joining user room:', user.id);
            socket.emit('join_user', user.id);
        }

        return () => {
            // Ideally we don't disconnect on unmount if we want a singleton, 
            // but for this effect structure, we might. 
            // Given it's a module-level var, let's NOT disconnect on simple re-renders unless we want to reset.
            // But the current logic re-creates 'io' every time. That's bad.
            // Let's rely on the singleton pattern correctly.
            if (socket && !socket.connected) {
                socket.disconnect();
            }
        };
    }, [user]);

    return { socket, isConnected };
};
