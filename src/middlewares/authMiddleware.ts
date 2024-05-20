import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

// Clave secreta JWT utilizada para firmar y verificar tokens
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

// Instancia de PrismaClient para interactuar con la base de datos
const prisma = new PrismaClient();

// Definición de tipo para la solicitud de autenticación
type AuthRequest = Request & { user?: User };

// Middleware para autenticar tokens JWT
export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // Obtener el encabezado de autorización de la solicitud
  const authHeader = req.headers['authorization'];
  const jwtToken = authHeader?.split(' ')[1];

  // Verificar si se proporcionó un token JWT
  if (!jwtToken) {
    return res.sendStatus(401); // Devolver estado de no autorizado si no se proporciona un token
  }

  try {
    // Decodificar el token JWT y extraer el payload
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };

    // Buscar el token en la base de datos utilizando el tokenId del payload
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    // Verificar si el token es válido y no ha expirado
    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: 'API token expired' }); // Devolver estado de no autorizado si el token ha expirado
    }

    // Asignar el usuario asociado al token a la solicitud
    req.user = dbToken.user;
  } catch (e) {
    return res.sendStatus(401); // Devolver estado de no autorizado si hay algún error durante la autenticación
  }

  next(); // Llamar a la siguiente función de middleware
}
