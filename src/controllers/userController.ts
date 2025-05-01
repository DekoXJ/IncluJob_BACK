import { RequestHandler } from 'express';
import { getUserById, updateUserProfile } from '../models/userModel';
import { AuthRequest } from '../middleware/auth';

export const getProfileHandler: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const user = await getUserById(req.userId!);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfileHandler: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const updated = await updateUserProfile(req.userId!, req.body);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
