import supabase from '../utils/supabase';

export class UserService {
    async getUserProfile(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async updateUserProfile(userId: string, updates: { name?: string; avatar_url?: string }) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
    async getAllUsers() {
        // In a real app we might paginate or filter. 
        // For this collaborative tool, knowing all team members is fine.
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('name');

        if (error) throw new Error(error.message);
        return data;
    }
}
