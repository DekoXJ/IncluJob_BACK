// src/routes/jobRoutes.ts
import { Router } from 'express';
import {
  createJobHandler,
  listJobsHandler,
  getJobHandler,
  updateJobHandler,
  deleteJobHandler,
} from '../controllers/jobController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/',    listJobsHandler);
router.get('/:id', getJobHandler);

// Rutas protegidas
router.post('/',   authenticate, createJobHandler);
router.put('/:id', authenticate, updateJobHandler);
router.delete('/:id', authenticate, deleteJobHandler);

export default router;