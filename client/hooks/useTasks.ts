import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchTasks(filters: any) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/tasks?${params}`, {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
}

async function createTask(taskData: any) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(taskData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create task');
    }
    return res.json();
}

async function updateTask({ id, updates }: { id: string; updates: any }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
}

async function deleteTask(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
}

// Add Update/Delete similarly if needed

export function useTasks(filters: any = {}) {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: () => fetchTasks(filters),
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}
