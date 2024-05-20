import express from 'express'; // Importa Express
import userRoutes from './routes/userRoutes'; // Importa las rutas relacionadas con los usuarios
import tweetRoutes from './routes/tweetRoutes'; // Importa las rutas relacionadas con los tweets
import authRoutes from './routes/authRoutes'; // Importa las rutas relacionadas con la autenticación
import { authenticateToken } from './middlewares/authMiddleware'; // Importa el middleware de autenticación

const app = express(); // Crea una instancia de la aplicación Express
app.use(express.json()); // Configura Express para analizar solicitudes con formato JSON

// Configura las rutas de la aplicación
app.use('/user', authenticateToken, userRoutes); // Las solicitudes a /user pasan por el middleware de autenticación antes de dirigirse a userRoutes
app.use('/tweet', authenticateToken, tweetRoutes); // Las solicitudes a /tweet pasan por el middleware de autenticación antes de dirigirse a tweetRoutes
app.use('/auth', authRoutes); // Las solicitudes a /auth se manejan directamente por authRoutes

// Ruta de inicio que simplemente responde con un mensaje indicando que el servidor está en funcionamiento
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Inicia el servidor en el puerto 3000 y muestra un mensaje en la consola
app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});
