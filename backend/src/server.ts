import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars BEFORE importing database (which reads SUPABASE_URL/KEY)
dotenv.config();

import { supabase } from './core/database';
import { errorHandler, notFound } from './middlewares/error';

// ─── Routes ───────────────────────────────────────────────────
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import clubsRoutes from './modules/clubs/clubs.routes';
import eventsRoutes from './modules/events/events.routes';
import newsRoutes from './modules/news/news.routes';
import announcementsRoutes from './modules/announcements/announcements.routes';
import settingsRoutes from './modules/settings/settings.routes';
import statisticsRoutes from './modules/statistics/statistics.routes';
import passJeunesRoutes from './modules/pass-jeunes/pass-jeunes.routes';

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
app.use('/uploads', express.static(path.resolve(uploadDir)));

// ─── Routes de l'API v1 ───────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/clubs', clubsRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/announcements', announcementsRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/pass-jeunes', passJeunesRoutes);

// ─── Route de santé (Health Check) ───────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    message: "API de gestion des clubs — Maison des Jeunes Al Qods",
    version: '1.1.0',
    database: 'Supabase PostgreSQL',
    endpoints: [
      'POST   /api/v1/auth/login',
      'POST   /api/v1/auth/register',
      'POST   /api/v1/auth/logout',
      'POST   /api/v1/auth/refresh-token',
      'POST   /api/v1/auth/forgot-password',
      'POST   /api/v1/auth/reset-password',
      'GET    /api/v1/users',
      'GET    /api/v1/clubs',
      'GET    /api/v1/events',
      'GET    /api/v1/news',
      'GET    /api/v1/announcements',
      'GET    /api/v1/settings',
      'GET    /api/v1/statistics/admin',
      'GET    /api/v1/statistics/encadrant',
      'GET    /api/v1/pass-jeunes',
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
  console.log(`🗄️  [database] Connecté à Supabase`);
  console.log(`🔗 [API]     Endpoints disponibles → http://localhost:${port}/\n`);
});
