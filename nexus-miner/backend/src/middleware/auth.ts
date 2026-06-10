import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type JwtPayload = { userId: number };

declare global { namespace Express { interface Request { user?: JwtPayload } } }

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: 'Нет токена авторизации' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET ?? 'dev_secret') as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}
