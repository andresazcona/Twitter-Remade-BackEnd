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
exports.authenticateSessionCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';
const prisma = new client_1.PrismaClient();
function authenticateSessionCookie(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies['session'];
        if (!token) {
            return res.sendStatus(401);
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = yield prisma.user.findUnique({ where: { id: payload.userId } });
            if (!user) {
                return res.sendStatus(401);
            }
            req.user = user;
        }
        catch (e) {
            return res.sendStatus(401);
        }
        next();
    });
}
exports.authenticateSessionCookie = authenticateSessionCookie;
