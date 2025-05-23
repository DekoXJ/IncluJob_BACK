import { pool } from '../config/db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  name: string;
  email: string;
  disability: string;
  password?: string;
  role_id: number;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  disability: string;
  role_id: number;
}): Promise<User> {
  const hashed = await bcrypt.hash(data.password, 10);
  const result = await pool.query<User>(
    `INSERT INTO users (name, email, password, disability, role_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, disability, role_id`,
    [data.name, data.email, hashed, data.disability, data.role_id]
  );
  return result.rows[0];
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const res = await pool.query<User>(
    `SELECT id, name, email, password, disability, role_id FROM users WHERE email=$1`,
    [email]
  );
  return res.rows[0];
}

export async function getUserById(id: number): Promise<User | null> {
  const res = await pool.query<User>(
    `SELECT id, name, email, disability, role_id, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return res.rows[0] || null;
}

export async function updateUserProfile(
  id: number,
  data: {
    name?: string;
    email?: string;
    disability?: string;
    password?: string;
    role_id?: number;
  }
): Promise<User | null> {
  const sets: string[] = [];
  const vals: any[] = [];
  let idx = 1;

  if (data.name !== undefined) {
    sets.push(`name = $${idx++}`);
    vals.push(data.name);
  }
  if (data.email !== undefined) {
    sets.push(`email = $${idx++}`);
    vals.push(data.email);
  }
  if (data.disability !== undefined) {
    sets.push(`disability = $${idx++}`);
    vals.push(data.disability);
  }
  if (data.password !== undefined) {
    const hash = await bcrypt.hash(data.password, 10);
    sets.push(`password = $${idx++}`);
    vals.push(hash);
  }
  if (data.role_id !== undefined) {
    sets.push(`role_id = $${idx++}`);
    vals.push(data.role_id);
  }

  if (sets.length === 0) return getUserById(id);

  vals.push(id);
  const res = await pool.query<User>(
    `UPDATE users
     SET ${sets.join(', ')}
     WHERE id = $${idx}
     RETURNING id, name, email, disability, role_id, created_at`,
    vals
  );
  return res.rows[0] || null;
}
