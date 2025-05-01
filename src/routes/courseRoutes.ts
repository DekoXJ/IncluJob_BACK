// src/routes/courseRoutes.ts
import { Router } from 'express';
import {
  createCourseHandler,
  listCoursesHandler,
  getCourseHandler,
  updateCourseHandler,
  deleteCourseHandler,
} from '../controllers/courseController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/',    listCoursesHandler);
router.get('/:id', getCourseHandler);

// Rutas protegidas
router.post('/',    authenticate, createCourseHandler);
router.put('/:id',  authenticate, updateCourseHandler);
router.delete('/:id', authenticate, deleteCourseHandler);

export default router;
