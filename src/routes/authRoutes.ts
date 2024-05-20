import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { sendEmailToken } from '../services/emailService'; // Se asume que hay un servicio para enviar tokens por correo electrónico

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10; // Duración de validez del token de correo electrónico (en minutos)
const AUTHENTICATION_EXPIRATION_HOURS = 12; // Duración de validez del token de autenticación (en horas)
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET'; // Clave secreta para firmar los tokens JWT
const router = Router(); // Instancia de un router de Express
const prisma = new PrismaClient(); // Instancia de PrismaClient para interactuar con la base de datos

// Función para generar un token de correo electrónico aleatorio
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Función para generar un token JWT de autenticación
function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: 'HS256',
    noTimestamp: true,
  });
}

// Ruta para iniciar el proceso de autenticación
router.post('/login', async (req, res) => {
  const { email } = req.body;

  // Generar un token de correo electrónico y establecer su fecha de expiración
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    // Crear un nuevo token de correo electrónico en la base de datos y asociarlo con el usuario correspondiente
    const createdToken = await prisma.token.create({
      data: {
        type: 'EMAIL',
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    // Enviar el token de correo electrónico al usuario (no implementado en este código)
    await sendEmailToken(email, emailToken);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ error: "Couldn't start the authentication process" });
  }
});

// Ruta para validar el token de correo electrónico y generar un token de autenticación
router.post('/authenticate', async (req, res) => {
  const { email, emailToken } = req.body;

  // Buscar el token de correo electrónico en la base de datos
  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });

  // Verificar si el token de correo electrónico es válido y no ha expirado
  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: 'Token expired!' });
  }

  // Verificar si el correo electrónico del usuario coincide con el proporcionado en la solicitud
  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  // Generar un token de autenticación y asociarlo con el usuario
  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );
  const apiToken = await prisma.token.create({
    data: {
      type: 'API',
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  // Invalidar el token de correo electrónico utilizado
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  // Generar el token JWT de autenticación
  const authToken = generateAuthToken(apiToken.id);

  res.json({ authToken });
});

export default router;
