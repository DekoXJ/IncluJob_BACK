// src/models/courseModel.ts
import { pool } from '../config/db';

export interface Course {
  id: number;
  title: string;
  description?: string;
  type: 'text' | 'video' | 'audio';
  resource_url: string;
  created_at: string;
}

export async function createCourse(data: {
  title: string;
  description?: string;
  type: 'text' | 'video' | 'audio';
  resource_url: string;
}): Promise<Course> {
  const result = await pool.query<Course>(
    `INSERT INTO courses (title, description, type, resource_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, type, resource_url, created_at`,
    [data.title, data.description || null, data.type, data.resource_url]
  );
  return result.rows[0];
}

export async function getAllCourses(): Promise<Course[]> {
  const result = await pool.query<Course>(
    `SELECT id, title, description, type, resource_url, created_at
     FROM courses
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getCourseById(id: number): Promise<Course | null> {
  const result = await pool.query<Course>(
    `SELECT id, title, description, type, resource_url, created_at
     FROM courses
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateCourse(
  id: number,
  data: {
    title?: string;
    description?: string;
    type?: 'text' | 'video' | 'audio';
    resource_url?: string;
  }
): Promise<Course | null> {
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
  if (data.type !== undefined) {
    sets.push(`type = $${idx++}`);
    values.push(data.type);
  }
  if (data.resource_url !== undefined) {
    sets.push(`resource_url = $${idx++}`);
    values.push(data.resource_url);
  }
  if (sets.length === 0) {
    return getCourseById(id);
  }
  values.push(id);
  const result = await pool.query<Course>(
    `UPDATE courses
     SET ${sets.join(', ')}
     WHERE id = $${idx}
     RETURNING id, title, description, type, resource_url, created_at`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteCourse(id: number): Promise<void> {
  await pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
}
