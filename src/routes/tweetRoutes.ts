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
    res.status(400).json({ error: 'Username and email should be unique' });
  }
});

// Listar Tweets
router.get('/', async (req, res) => {
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

  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found!' });
  }

  res.json(tweet);
});

// Actualizar un Tweet
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;

  try {
    const updatedTweet = await prisma.tweet.update({
      where: { id: Number(id) },
      data: {
        content,
        image,
      },
      include: { user: true },
    });
    res.json(updatedTweet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un Tweet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

// Buscar Tweets por contenido
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  
  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        content: {
          contains: query,
          mode: 'insensitive',
        },
      },
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

    res.json(tweets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
