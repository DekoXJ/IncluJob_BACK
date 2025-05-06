
// src/models/roleModel.ts
import { pool } from '../config/db';

export interface Role {
  id: number;
  name: string;
}

export async function createRole(data: { name: string; description: string }): Promise<Role> {
    const result = await pool.query<Role>(
      `INSERT INTO roles (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.description]
    );
    return result.rows[0];
  }
  

  export async function getAllRoles() {
    const result = await pool.query('SELECT * FROM roles');
    return result.rows; // Devuelve los resultados
  }
export async function getRoleById(id: number): Promise<Role | null> {
  const result = await pool.query<Role>(
    `SELECT id, name FROM roles WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateRole(id: number, data: { name: string }): Promise<Role | null> {
  const result = await pool.query<Role>(
    `UPDATE roles SET name = $1 WHERE id = $2 RETURNING *`,
    [data.name, id]
  );
  return result.rows[0] || null;
}

export async function deleteRole(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM roles WHERE id = $1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }