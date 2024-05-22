import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email, name, username, password } = req.body;

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword, // Specify 'password' as a known property
        bio: "Hello, I'm new on Twitter",
      },
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'Username and email should be unique' });
  }
});

export default router;
