import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create Tweet
router.post('/', async (req, res) => {
  const { content, image } = req.body;
  // @ts-ignore
  const user = req.user;

  try {
    // Crea un nuevo tweet en la base de datos, asociándolo con el usuario actual
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
      include: { user: true },
    });

    res.json(result);
  } catch (e) {
    // Maneja los errores de validación (por ejemplo, campos duplicados)
    res.status(400).json({ error: 'Username and email should be unique' });
  }
});

// Listar Tweets
router.get('/', async (req, res) => {
  // Obtiene todos los tweets de la base de datos, incluyendo la información del usuario que los creó
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  res.json(allTweets);
});

// Obtener un Tweet específico por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Query tweet with id: ', id);

  // Busca un tweet específico por su ID en la base de datos, incluyendo la información del usuario que lo creó
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  
  // Si el tweet no existe, devuelve un estado 404
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found!' });
  }

  res.json(tweet);
});

// Actualizar un Tweet
router.put('/:id', (req, res) => {
  const { id } = req.params;
  
  // Devuelve un estado 501 (No implementado) para la actualización de tweets
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// Eliminar un Tweet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  // Elimina un tweet de la base de datos utilizando su ID
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
