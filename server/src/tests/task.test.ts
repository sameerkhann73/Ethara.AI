import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dtos/task.dto';
import { getIO } from '../socket/socket';

// Mock dependencies
jest.mock('../repositories/task.repository', () => {
    return {
        TaskRepository: jest.fn().mockImplementation(() => ({
            create: jest.fn().mockResolvedValue({
                id: 'task-123',
                title: 'Test Task',
                creator_id: 'user-1',
                assigned_to_id: 'user-2',
                status: 'TODO'
            }),
        }))
    };
});

jest.mock('../socket/socket', () => ({
    getIO: jest.fn().mockReturnValue({
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
    })
}));

describe('TaskService', () => {
    let taskService: TaskService;
    let mockIO: any;

    beforeEach(() => {
        taskService = new TaskService();
        mockIO = getIO();
    });

    describe('createTask', () => {
        it('should create a task and emit socket events', async () => {
            const taskData: CreateTaskDto = {
                title: 'Test Task',
                priority: 'MEDIUM',
                status: 'TODO',
                assignedToId: 'user-2'
            };

            const result = await taskService.createTask('user-1', taskData);

            expect(result).toBeDefined();
            expect(result.id).toBe('task-123');

            // Verification of Socket emission
            expect(mockIO.emit).toHaveBeenCalledWith('task:created', expect.any(Object));

            // Verification of Assignment Notification
            expect(mockIO.to).toHaveBeenCalledWith('user-2');
            expect(mockIO.emit).toHaveBeenCalledWith('notification:new', expect.objectContaining({
                type: 'TASK_ASSIGNED'
            }));
        });
    });
});
