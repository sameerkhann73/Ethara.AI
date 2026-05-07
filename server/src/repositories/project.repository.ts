import supabase from '../utils/supabase';

export class ProjectRepository {
    async create(data: { name: string; description?: string; created_by: string; status?: string; priority?: string; due_date?: string; tags?: string[] }) {
        const { data: project, error } = await supabase
            .from('projects')
            .insert({
                name: data.name,
                description: data.description,
                created_by: data.created_by,
                status: data.status || 'TODO',
                priority: data.priority || 'MEDIUM',
                due_date: data.due_date,
                tags: data.tags || []
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return project;
    }

    async update(projectId: string, data: any) {
        const { data: project, error } = await supabase
            .from('projects')
            .update(data)
            .eq('id', projectId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return project;
    }

    async delete(projectId: string) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) throw new Error(error.message);
    }

    async addMember(projectId: string, userId: string, role: string) {
        const { data: member, error } = await supabase
            .from('project_members')
            .insert({ project_id: projectId, user_id: userId, role })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return member;
    }

    async removeMember(projectId: string, userId: string) {
        const { error } = await supabase
            .from('project_members')
            .delete()
            .match({ project_id: projectId, user_id: userId });

        if (error) throw new Error(error.message);
    }

    async findUserProjects(userId: string) {
        const { data, error } = await supabase
            .from('projects')
            .select('*, project_members!inner(role)')
            .eq('project_members.user_id', userId);

        if (error) throw new Error(error.message);
        return data;
    }

    async findById(projectId: string) {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                project_members(user_id, role, users(name, email, avatar_url)),
                tasks(*)
            `)
            .eq('id', projectId)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async checkRole(projectId: string, userId: string) {
        const { data, error } = await supabase
            .from('project_members')
            .select('role')
            .match({ project_id: projectId, user_id: userId })
            .maybeSingle();

        if (error) return null;
        return data?.role;
    }
}
