import { pool } from '../config/db';

export interface Course {
  id: number;
  owner_id: number;
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
  owner_id: number;
}): Promise<Course> {
  const result = await pool.query<Course>(
    `INSERT INTO courses (title, description, type, resource_url, owner_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, owner_id, title, description, type, resource_url, created_at`,
    [data.title, data.description || null, data.type, data.resource_url, data.owner_id]
  );
  return result.rows[0];
}

export async function getAllCourses(): Promise<Course[]> {
  const result = await pool.query<Course>(
    `SELECT id, owner_id, title, description, type, resource_url, created_at
     FROM courses
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getCourseById(id: number): Promise<Course | null> {
  const result = await pool.query<Course>(
    `SELECT id, owner_id, title, description, type, resource_url, created_at
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
  const updates: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${index++}`);
    values.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push(`description = $${index++}`);
    values.push(data.description);
  }
  if (data.type !== undefined) {
    updates.push(`type = $${index++}`);
    values.push(data.type);
  }
  if (data.resource_url !== undefined) {
    updates.push(`resource_url = $${index++}`);
    values.push(data.resource_url);
  }

  if (updates.length === 0) {
    return getCourseById(id);
  }

  values.push(id);

  const query = `
    UPDATE courses
    SET ${updates.join(', ')}
    WHERE id = $${index}
    RETURNING id, owner_id, title, description, type, resource_url, created_at
  `;

  const result = await pool.query<Course>(query, values);
  return result.rows[0] || null;
}

export async function deleteCourse(id: number): Promise<void> {
  await pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
}
