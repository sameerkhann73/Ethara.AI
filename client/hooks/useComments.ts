import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchComments(taskId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
}

async function addComment({ taskId, content }: { taskId: string; content: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
}

export function useComments(taskId: string) {
    return useQuery({
        queryKey: ['comments', taskId],
        queryFn: () => fetchComments(taskId),
        enabled: !!taskId,
    });
}

export function useAddComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addComment,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.taskId] });
        },
    });
}
