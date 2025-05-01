// src/routes/userRoutes.ts
import { Router } from 'express';
import { getProfileHandler, updateProfileHandler } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getProfileHandler);
router.put('/me', authenticate, updateProfileHandler);

export default router;
