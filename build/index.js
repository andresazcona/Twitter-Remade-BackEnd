"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importa Express
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Importa las rutas relacionadas con los usuarios
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes")); // Importa las rutas relacionadas con los tweets
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Importa las rutas relacionadas con la autenticación
const authMiddleware_1 = require("./middlewares/authMiddleware"); // Importa el middleware de autenticación
const app = (0, express_1.default)(); // Crea una instancia de la aplicación Express
app.use(express_1.default.json()); // Configura Express para analizar solicitudes con formato JSON
// Configura las rutas de la aplicación
app.use('/user', authMiddleware_1.authenticateToken, userRoutes_1.default); // Las solicitudes a /user pasan por el middleware de autenticación antes de dirigirse a userRoutes
app.use('/tweet', authMiddleware_1.authenticateToken, tweetRoutes_1.default); // Las solicitudes a /tweet pasan por el middleware de autenticación antes de dirigirse a tweetRoutes
app.use('/auth', authRoutes_1.default); // Las solicitudes a /auth se manejan directamente por authRoutes
// Ruta de inicio que simplemente responde con un mensaje indicando que el servidor está en funcionamiento
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});
// Inicia el servidor en el puerto 3000 y muestra un mensaje en la consola
app.listen(3000, () => {
    console.log('Server ready at localhost:3000');
});
