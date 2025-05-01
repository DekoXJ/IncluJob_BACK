// src/routes/companyRoutes.ts
import { Router } from 'express';
import {
  createCompanyHandler,
  listCompaniesHandler,
  getCompanyHandler,
  updateCompanyHandler,
  deleteCompanyHandler,
} from '../controllers/companyController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/',     listCompaniesHandler);
router.get('/:id',  getCompanyHandler);

router.post('/',    authenticate, createCompanyHandler);
router.put('/:id',  authenticate, updateCompanyHandler);
router.delete('/:id', authenticate, deleteCompanyHandler);

export default router;
