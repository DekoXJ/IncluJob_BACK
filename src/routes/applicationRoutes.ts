// src/routes/applicationRoutes.ts
import { Router } from 'express';
import {
  applyJobHandler,
  listMyApplicationsHandler,
  listApplicationsByJobHandler,
  getApplicationHandler,
  updateApplicationHandler,
  deleteApplicationHandler,
} from '../controllers/applicationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Usuario aplica y ve sus postulaciones
router.post('/', authenticate, applyJobHandler);
router.get('/me', authenticate, listMyApplicationsHandler);

// Obtener todas las postulaciones de una vacante (p.ej. para empresa)
router.get('/job/:jobId', authenticate, listApplicationsByJobHandler);

// Detalle, actualización de estado y borrado
router.get('/:id', authenticate, getApplicationHandler);
router.put('/:id', authenticate, updateApplicationHandler);
router.delete('/:id', authenticate, deleteApplicationHandler);

export default router;
