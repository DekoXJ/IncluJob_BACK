import jwt from 'jsonwebtoken';

export function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Asegúrate de tener una clave secreta en tu .env
    return decoded; // Retorna el usuario decodificado del token
  } catch (err) {
    throw new Error('Invalid token');
  }
}
