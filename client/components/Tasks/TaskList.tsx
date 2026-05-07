import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpdateTask } from '@/hooks/useTasks';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    created_at: string;
    due_date?: string;
    assigned_to_id?: string;
}

interface TaskListProps {
    tasks: Task[];
    isAdmin?: boolean;
    currentUserId?: string;
}

export function TaskList({ tasks, isAdmin = false, currentUserId }: TaskListProps) {
    const updateTask = useUpdateTask();

    if (!tasks || tasks.length === 0) {
        return (
            <div className="py-8 text-center text-gray-600 border border-dashed rounded bg-gray-50">
                No tasks found.
            </div>
        );
    }

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await updateTask.mutateAsync({ id: taskId, updates: { status: newStatus } });
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => {
                const isAssignedToMe = task.assigned_to_id === currentUserId;
                const canUpdateStatus = isAdmin || isAssignedToMe;

                return (
                    <div key={task.id} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-gray-700 border-gray-300 bg-gray-50">
                                {task.priority}
                            </Badge>
                            <span className="text-[10px] text-gray-500 font-medium">
                                {new Date(task.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-slate-900 text-base mb-1">
                                {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium line-clamp-2">
                                {task.description || 'No description provided'}
                            </p>
                        </div>

                        {/* Assignment Info */}
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            <User className="h-3 w-3" />
                            {isAssignedToMe ? 'Assigned to You' : 'Assigned to Member'}
                        </div>

                        {/* Inline Status Controls - NO POPUPS */}
                        <div className="mt-auto pt-4 flex flex-col gap-2 border-t border-gray-100">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                <span>Current Status: {task.status.replace('_', ' ')}</span>
                            </div>
                            
                            {canUpdateStatus && (
                                <div className="flex gap-2">
                                    {task.status !== 'IN_PROGRESS' && task.status !== 'COMPLETED' && (
                                        <button 
                                            onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                            className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100 uppercase"
                                        >
                                            Start Progress
                                        </button>
                                    )}
                                    {task.status !== 'COMPLETED' && (
                                        <button 
                                            onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                                            className="flex-1 px-2 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-bold hover:bg-green-100 uppercase"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                    {task.status === 'COMPLETED' && (
                                        <button 
                                            onClick={() => handleStatusChange(task.id, 'TODO')}
                                            className="flex-1 px-2 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded text-[10px] font-bold hover:bg-gray-100 uppercase"
                                        >
                                            Reopen
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
