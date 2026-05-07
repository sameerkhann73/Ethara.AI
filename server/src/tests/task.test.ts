import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dtos/task.dto';

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

describe('TaskService', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    describe('createTask', () => {
        it('should create a task and return it', async () => {
            const taskData: CreateTaskDto = {
                title: 'Test Task',
                priority: 'MEDIUM',
                status: 'TODO',
                assignedToId: 'user-2'
            };

            const result = await taskService.createTask('user-1', taskData);

            expect(result).toBeDefined();
            expect(result.id).toBe('task-123');
            expect(result.title).toBe('Test Task');
        });
    });
});
