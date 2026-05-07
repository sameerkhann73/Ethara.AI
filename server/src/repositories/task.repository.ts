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
                assigned_to_id: taskData.assignedToId,
                project_id: taskData.projectId,
                tags: taskData.tags || []
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async findAll(filters: { creatorId?: string; assignedToId?: string; status?: string; priority?: string }) {
        let query = supabase.from('tasks').select('*');

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.priority) query = query.eq('priority', filters.priority);
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
        // Map camelCase to snake_case and include tags
        const payload: any = {
            title: updates.title,
            description: updates.description,
            priority: updates.priority,
            status: updates.status,
            tags: updates.tags
        };

        if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
        if (updates.assignedToId !== undefined) payload.assigned_to_id = updates.assignedToId;

        const { data, error } = await supabase
            .from('tasks')
            .update(payload)
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
