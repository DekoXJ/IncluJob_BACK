import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/userModel';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, disability, role_id } = req.body;

    const userRole = role_id || 1; 
    
    const user = await createUser({ name, email, password, disability, role_id: userRole });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      disability: user.disability,
      role_id: user.role_id
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || !user.password) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role_id: user.role_id }, 
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
