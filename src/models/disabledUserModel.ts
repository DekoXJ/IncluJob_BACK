import { pool } from '../config/db';

export interface DisabledUser {
  id: number;
  user_id: number;
  disability_certificate_url: string;
  verified: boolean;
  created_at: string;
}

export async function createDisabledUser(data: {
  user_id: number;
  disability_certificate_url: string;
}): Promise<DisabledUser> {
  const result = await pool.query<DisabledUser>(
    `INSERT INTO disabled_users (user_id, disability_certificate_url)
     VALUES ($1, $2)
     RETURNING *`,
    [data.user_id, data.disability_certificate_url]
  );
  return result.rows[0];
}

export async function getDisabledUserByUserId(user_id: number): Promise<DisabledUser | null> {
  const result = await pool.query<DisabledUser>(
    `SELECT * FROM disabled_users WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0] || null;
}
