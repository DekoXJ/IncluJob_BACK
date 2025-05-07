import { RequestHandler } from 'express';
import { getUserById, updateUserProfile } from '../models/userModel';
import { AuthRequest } from '../middleware/auth';

export const getProfileHandler: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    // Obtener el usuario por ID, ahora se incluye role_id
    const user = await getUserById(req.userId!);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user); // El perfil incluye role_id
  } catch (err) {
    next(err);
  }
};

export const updateProfileHandler: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    // Llamar a la función de actualización, pasando los datos del body (que pueden incluir role_id)
    const updated = await updateUserProfile(req.userId!, req.body);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updated); // El perfil actualizado incluirá role_id si se ha modificado
  } catch (err) {
    next(err);
  }
};
