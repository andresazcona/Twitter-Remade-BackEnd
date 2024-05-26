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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, username } = req.body;
    // Verificar si el usuario ya existe
    const existingUser = yield prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
    }
    // Hashear la contraseña
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        const newUser = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                username,
            },
        });
        res.status(201).json(newUser);
    }
    catch (e) {
        res.status(400).json({ error: 'Error creating user' });
    }
}));
// Ruta para iniciar sesión
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.password === null) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const validPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
}));
exports.default = router;
