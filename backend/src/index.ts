import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import workoutsRoutes from './routes/workouts';
import profileRoutes from './routes/profile';
import authRoutes from './routes/auth';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
});

app.use(limiter);

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/workouts', workoutsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Erreur serveur:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

