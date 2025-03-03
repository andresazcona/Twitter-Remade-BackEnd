"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/user', authMiddleware_1.authenticateSessionCookie, userRoutes_1.default);
app.use('/tweet', authMiddleware_1.authenticateSessionCookie, tweetRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});
app.listen(3000, () => {
    console.log('Server ready at localhost:3000');
});
