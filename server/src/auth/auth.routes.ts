import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/challenge', AuthController.getChallenge);
router.post('/verify', AuthController.verify);
router.post('/refresh', AuthController.refresh);
router.get('/me', authenticateToken, AuthController.getCurrentUser);

export default router;
