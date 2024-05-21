import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router(); // Crea un router de Express
const prisma = new PrismaClient(); // Instancia de PrismaClient para interactuar con la base de datos

// Crear usuario
router.post('/', async (req, res) => {
  const { email, name, username, password } = req.body; // Extrae los datos del cuerpo de la solicitud

  try {
    // Crea un nuevo usuario en la base de datos con los datos proporcionados
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I'm new on Twitter", // Bio predeterminada para el nuevo usuario
      },
    });

    res.json(result); // Devuelve el usuario creado en formato JSON
  } catch (e) {
    res.status(400).json({ error: 'Username and email should be unique' }); // Maneja errores de validación
  }
});

// Listar usuarios
router.get('/', async (req, res) => {
  const allUser = await prisma.user.findMany({
    // select: {
    //   id: true,
    //   name: true,
    //   image: true,
    //   bio: true,
    // },
  });

  res.json(allUser); // Devuelve todos los usuarios en formato JSON
});

// Obtener un usuario específico por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Obtiene el ID del usuario de los parámetros de la URL

  // Busca un usuario específico por su ID en la base de datos, incluyendo sus tweets asociados
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });

  res.json(user); // Devuelve el usuario encontrado en formato JSON
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Obtiene el ID del usuario de los parámetros de la URL
  const { bio, name, image } = req.body; // Extrae los datos actualizados del cuerpo de la solicitud

  try {
    // Actualiza los datos del usuario en la base de datos
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });

    res.json(result); // Devuelve el usuario actualizado en formato JSON
  } catch (e) {
    res.status(400).json({ error: `Failed to update the user` }); // Maneja errores de actualización
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Obtiene el ID del usuario de los parámetros de la URL
  
  // Elimina el usuario de la base de datos utilizando su ID
  await prisma.user.delete({ where: { id: Number(id) } });

  res.sendStatus(200); // Devuelve un estado 200 (OK) para indicar que el usuario ha sido eliminado correctamente
});

export default router; // Exporta el router para su uso en otros archivos
