// src/models/applicationModel.ts
import { pool } from '../config/db';

export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  status: string;
  applied_at: string;
}

export async function createApplication(data: {
  user_id: number;
  job_id: number;
}): Promise<Application> {
  const result = await pool.query<Application>(
    `INSERT INTO applications (user_id, job_id)
     VALUES ($1, $2)
     RETURNING id, user_id, job_id, status, applied_at`,
    [data.user_id, data.job_id]
  );
  return result.rows[0];
}

export async function getApplicationsByUser(user_id: number): Promise<Application[]> {
  const result = await pool.query<Application>(
    `SELECT id, user_id, job_id, status, applied_at
     FROM applications
     WHERE user_id = $1
     ORDER BY applied_at DESC`,
    [user_id]
  );
  return result.rows;
}

export async function getApplicationsByJob(job_id: number): Promise<Application[]> {
  const result = await pool.query<Application>(
    `SELECT id, user_id, job_id, status, applied_at
     FROM applications
     WHERE job_id = $1
     ORDER BY applied_at DESC`,
    [job_id]
  );
  return result.rows;
}

export async function getApplicationById(id: number): Promise<Application | null> {
  const result = await pool.query<Application>(
    `SELECT id, user_id, job_id, status, applied_at
     FROM applications
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateApplicationStatus(
  id: number,
  status: string
): Promise<Application | null> {
  const result = await pool.query<Application>(
    `UPDATE applications
     SET status = $1
     WHERE id = $2
     RETURNING id, user_id, job_id, status, applied_at`,
    [status, id]
  );
  return result.rows[0] || null;
}

export async function deleteApplication(id: number): Promise<void> {
  await pool.query(`DELETE FROM applications WHERE id = $1`, [id]);
}