"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Create Tweet
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    // @ts-ignore
    const user = req.user;
    try {
        // Crea un nuevo tweet en la base de datos, asociándolo con el usuario actual
        const result = yield prisma.tweet.create({
            data: {
                content,
                image,
                userId: user.id,
            },
            include: { user: true },
        });
        res.json(result);
    }
    catch (e) {
        // Maneja los errores de validación (por ejemplo, campos duplicados)
        res.status(400).json({ error: 'Username and email should be unique' });
    }
}));
// Listar Tweets
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtiene todos los tweets de la base de datos, incluyendo la información del usuario que los creó
    const allTweets = yield prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true, // Incluye la imagen del usuario
                },
            },
        },
    });
    res.json(allTweets);
}));
// Obtener un Tweet específico por su ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log('Query tweet with id: ', id);
    // Busca un tweet específico por su ID en la base de datos, incluyendo la información del usuario que lo creó
    const tweet = yield prisma.tweet.findUnique({
        where: { id: Number(id) },
        include: { user: true },
    });
    // Si el tweet no existe, devuelve un estado 404
    if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' });
    }
    res.json(tweet);
}));
// Actualizar un Tweet
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content, image } = req.body;
    try {
        const updatedTweet = yield prisma.tweet.update({
            where: { id: Number(id) },
            data: {
                content,
                image,
            },
            include: { user: true },
        });
        res.json(updatedTweet);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Eliminar un Tweet
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Elimina un tweet de la base de datos utilizando su ID
    yield prisma.tweet.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
}));
exports.default = router;
