import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/userModel';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, disability } = req.body;
    const user = await createUser({ name, email, password, disability });
    res.status(201).json(user);
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
        return;                  // ← return sin valor
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;                  // ← return sin valor
      }
  
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      );
  
      res.json({ token });       // ← sin devolver el resultado
    } catch (err) {
      next(err);
    }
  };
  