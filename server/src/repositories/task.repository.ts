import supabase from '../utils/supabase';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

export class TaskRepository {
    async create(taskData: CreateTaskDto & { creatorId: string }) {
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                title: taskData.title,
                description: taskData.description,
                due_date: taskData.dueDate,
                priority: taskData.priority,
                status: taskData.status,
                creator_id: taskData.creatorId,
                assigned_to_id: taskData.assignedToId
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async findAll(filters: { creatorId?: string; assignedToId?: string; status?: string; priority?: string }) { // Simplified filters for MVP
        let query = supabase.from('tasks').select('*');

        // Currently fetching all tasks relevant to user (created or assigned) if generic filter
        // Or applying specific filters

        // NOTE: For a real app, complex filtering logic would be here.
        // For now, let's allow fetching by generic options.

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.priority) query = query.eq('priority', filters.priority);

        // If strict creator/assignee filtering is requested (e.g. "My Tasks")
        if (filters.creatorId) query = query.eq('creator_id', filters.creatorId);
        if (filters.assignedToId) query = query.eq('assigned_to_id', filters.assignedToId);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data;
    }

    async findById(id: string) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async update(id: string, updates: UpdateTaskDto) {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                title: updates.title,
                description: updates.description,
                due_date: updates.dueDate,
                priority: updates.priority,
                status: updates.status,
                assigned_to_id: updates.assignedToId
            }) // Map camelCase to snake_case manually or use a helper
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async delete(id: string) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
        return true;
    }
}
