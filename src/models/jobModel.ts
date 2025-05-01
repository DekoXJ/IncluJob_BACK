// src/models/jobModel.ts
import { pool } from '../config/db';

export interface Job {
  id: number;
  company_id: number;
  title: string;
  description: string;
  requirements?: string;
  disability_filter?: string;
  created_at: string;
}

export async function createJob(data: {
  company_id: number;
  title: string;
  description: string;
  requirements?: string;
  disability_filter?: string;
}): Promise<Job> {
  const result = await pool.query<Job>(
    `INSERT INTO jobs (company_id, title, description, requirements, disability_filter)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, company_id, title, description, requirements, disability_filter, created_at`,
    [
      data.company_id,
      data.title,
      data.description,
      data.requirements || null,
      data.disability_filter || null,
    ]
  );
  return result.rows[0];
}

export async function getAllJobs(): Promise<Job[]> {
  const result = await pool.query<Job>(
    `SELECT id, company_id, title, description, requirements, disability_filter, created_at
     FROM jobs
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getJobById(id: number): Promise<Job | null> {
  const result = await pool.query<Job>(
    `SELECT id, company_id, title, description, requirements, disability_filter, created_at
     FROM jobs
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateJob(
  id: number,
  data: {
    title?: string;
    description?: string;
    requirements?: string;
    disability_filter?: string;
  }
): Promise<Job | null> {
  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.title !== undefined) {
    sets.push(`title = $${idx++}`);
    values.push(data.title);
  }
  if (data.description !== undefined) {
    sets.push(`description = $${idx++}`);
    values.push(data.description);
  }
  if (data.requirements !== undefined) {
    sets.push(`requirements = $${idx++}`);
    values.push(data.requirements);
  }
  if (data.disability_filter !== undefined) {
    sets.push(`disability_filter = $${idx++}`);
    values.push(data.disability_filter);
  }
  if (sets.length === 0) {
    return getJobById(id);
  }

  values.push(id);
  const result = await pool.query<Job>(
    `UPDATE jobs
     SET ${sets.join(', ')}
     WHERE id = $${idx}
     RETURNING id, company_id, title, description, requirements, disability_filter, created_at`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteJob(id: number): Promise<void> {
  await pool.query(`DELETE FROM jobs WHERE id = $1`, [id]);
}
