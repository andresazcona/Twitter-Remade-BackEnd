import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';
const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
 next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    
    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
}
