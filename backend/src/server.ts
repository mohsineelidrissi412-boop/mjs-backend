import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initializeDatabase } from './core/database';
import { errorHandler, notFound } from './middlewares/error';

// Routes
import authRoutes from './modules/auth/auth.routes';
import statisticsRoutes from './modules/statistics/statistics.routes';
import usersRoutes from './modules/users/users.routes';
import clubsRoutes from './modules/clubs/clubs.routes';
import eventsRoutes from './modules/events/events.routes';
import announcementsRoutes from './modules/announcements/announcements.routes';
import publicationsRoutes from './modules/publications/publications.routes';
import settingsRoutes from './modules/settings/settings.routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const uploadDir = process.env.UPLOAD_DIR || './uploads';

// ─── Middlewares globaux ───────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://monsite.com']
    : ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Servir les fichiers uploadés statiquement ────────────────
// Ex: http://localhost:8000/uploads/avatar-12345.jpg
app.use('/uploads', express.static(path.resolve(uploadDir)));

// ─── Initialiser la BDD fictive ───────────────────────────────
initializeDatabase();

// ─── Routes de l'API v1 ───────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/clubs', clubsRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/announcements', announcementsRoutes);
app.use('/api/v1/publications', publicationsRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/settings', settingsRoutes);

// ─── Route de santé (Health Check) ───────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    message: "API de gestion des clubs — Maison des Jeunes Al Qods",
    version: '1.0.0',
    docs: `http://localhost:${port}/api/v1`,
    endpoints: [
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/logout',
      'POST /api/v1/auth/refresh-token',
      'POST /api/v1/auth/register',
      'GET  /api/v1/users',
      'GET  /api/v1/clubs',
      'GET  /api/v1/events',
      'GET  /api/v1/publications',
      'GET  /api/v1/statistics/admin',
      'GET  /api/v1/statistics/encadrant',
      'GET  /api/v1/settings',
    ]
  });
});

// ─── Gestionnaire d'erreurs global (doit être en dernier) ─────
app.use(notFound);
app.use(errorHandler);

// ─── Lancer le serveur ────────────────────────────────────────
app.listen(port, () => {
  console.log(`\n✅ [server] Serveur lancé → http://localhost:${port}`);
  console.log(`📁 [uploads] Fichiers servis → http://localhost:${port}/uploads`);
  console.log(`🔗 [API]     Endpoints disponibles → http://localhost:${port}/\n`);
});
