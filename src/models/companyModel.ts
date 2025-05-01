// src/models/companyModel.ts
import { pool } from '../config/db';

export interface Company {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function createCompany(data: {
  name: string;
  description?: string;
}): Promise<Company> {
  const result = await pool.query<Company>(
    `INSERT INTO companies (name, description)
     VALUES ($1, $2)
     RETURNING id, name, description, created_at`,
    [data.name, data.description || null]
  );
  return result.rows[0];
}

export async function getAllCompanies(): Promise<Company[]> {
  const result = await pool.query<Company>(
    `SELECT id, name, description, created_at
     FROM companies
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getCompanyById(id: number): Promise<Company | null> {
  const result = await pool.query<Company>(
    `SELECT id, name, description, created_at
     FROM companies
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateCompany(
  id: number,
  data: { name?: string; description?: string }
): Promise<Company | null> {
  // Construimos el SET dinámicamente
  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.name !== undefined) {
    sets.push(`name = $${idx++}`);
    values.push(data.name);
  }
  if (data.description !== undefined) {
    sets.push(`description = $${idx++}`);
    values.push(data.description);
  }
  if (sets.length === 0) return getCompanyById(id);

  values.push(id);
  const result = await pool.query<Company>(
    `UPDATE companies
     SET ${sets.join(', ')}
     WHERE id = $${idx}
     RETURNING id, name, description, created_at`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteCompany(id: number): Promise<void> {
  await pool.query(`DELETE FROM companies WHERE id = $1`, [id]);
}
