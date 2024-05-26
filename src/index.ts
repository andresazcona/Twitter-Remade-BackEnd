import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateSessionCookie } from './middlewares/authMiddleware';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/user', authenticateSessionCookie, userRoutes);
app.use('/tweet', authenticateSessionCookie, tweetRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});
