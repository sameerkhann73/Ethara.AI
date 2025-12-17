import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import { getProfile, updateProfile, getAllUsers } from '../controllers/user.controller';

const router = Router();

router.use(authenticateUser);

router.get('/', getAllUsers);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

export default router;
