import { pool } from '../config/db';

export interface UserRole {
  user_id: number;
  role_id: number;
}

export const assignRoleToUser = async (userId: number, roleId: number): Promise<void> => {
  await pool.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, roleId]
  );
};

export const removeUserRole = async (userId: number, roleId: number): Promise<void> => {
  await pool.query(
    `DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`,
    [userId, roleId]
  );
};

export const getUserRoles = async (userId: number): Promise<{ role_id: number, name: string, description: string }[]> => {
  const result = await pool.query(
    `SELECT r.id as role_id, r.name, r.description
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = $1`,
    [userId]
  );
  return result.rows;
};