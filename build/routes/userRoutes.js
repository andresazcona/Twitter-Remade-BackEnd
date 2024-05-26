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
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, username, password } = req.body;
    // Hashear la contraseña
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        const result = yield prisma.user.create({
            data: {
                email,
                name,
                username,
                password: hashedPassword, // Specify 'password' as a known property
                bio: "Hello, I'm new on Twitter", // Add 'bio' property
            },
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: 'Username and email should be unique' });
    }
}));
exports.default = router;
