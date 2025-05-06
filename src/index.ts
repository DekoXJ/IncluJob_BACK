import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import { pool } from './config/db';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';  
import jobRoutes from './routes/jobRoutes';          
import { errorHandler } from './middleware/errorHandler';
import courseRoutes from './routes/courseRoutes';
import applicationRoutes from './routes/applicationRoutes';
import userRoutes from './routes/userRoutes';
import rolesRouter from './routes/rolesRoutes';

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL en:', res.rows[0].now);

    app.use('/api/auth', authRoutes);
    app.use('/api/companies', companyRoutes);
    app.use('/api/users',     userRoutes); 
    app.use('/api/jobs', jobRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/roles', rolesRouter);
    app.use('/api/applications', applicationRoutes);
    app.use(errorHandler);

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos:', err);
    process.exit(1);
  }
})();
