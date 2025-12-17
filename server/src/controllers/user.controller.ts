import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const userService = new UserService();

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.id;
        const user = await userService.getUserProfile(userId);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.id;
        const updates = req.body;
        const user = await userService.updateUserProfile(userId, updates);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
