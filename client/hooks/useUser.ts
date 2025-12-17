import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/users/profile`, {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

async function updateProfile(updates: { name?: string; avatar_url?: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
}

export function useUser() {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchProfile,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
}

async function fetchAllUsers() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

export function useAllUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUsers,
    });
}
