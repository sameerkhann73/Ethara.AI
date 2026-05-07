import supabase from '../utils/supabase';

export class CommentRepository {
    async create(data: { task_id: string; user_id: string; content: string }) {
        const { data: comment, error } = await supabase
            .from('task_comments')
            .insert(data)
            .select(`
                *,
                users(name, avatar_url)
            `)
            .single();

        if (error) throw new Error(error.message);
        return comment;
    }

    async findByTaskId(taskId: string) {
        const { data, error } = await supabase
            .from('task_comments')
            .select(`
                *,
                users(name, avatar_url)
            `)
            .eq('task_id', taskId)
            .order('created_at', { ascending: true });

        if (error) throw new Error(error.message);
        return data;
    }

    async delete(commentId: string, userId: string) {
        const { error } = await supabase
            .from('task_comments')
            .delete()
            .match({ id: commentId, user_id: userId });

        if (error) throw new Error(error.message);
    }
}
