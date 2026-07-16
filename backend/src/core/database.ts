import { Security } from './security';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'ENCADRANT' | 'MEMBER';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  profile_picture_url?: string;
  cv_url?: string;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  logo_url?: string;
  encadrant_ids: number[];
  member_ids: number[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  club_id?: number;
  creator_id: number;
}

export interface Publication {
  id: number;
  text: string;
  author_id: number;
  image_urls: string[];
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  club_id: number;
  creator_id: number;
}

export interface JoinRequest {
  id: number;
  club_id: number;
  user_id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Comment {
  id: number;
  publication_id: number;
  author_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Interaction {
  publication_id: number;
  user_id: number;
  type: 'LIKE' | 'DISLIKE';
}

// BDD en mémoire
export const mockUsers: User[] = [];
export const mockClubs: Club[] = [];
export const mockEvents: Event[] = [];
export const mockPublications: Publication[] = [];
export const mockAnnouncements: Announcement[] = [];
export const mockJoinRequests: JoinRequest[] = [];
export const mockComments: Comment[] = [];
export const mockInteractions: Interaction[] = [];

// Initialiser les données par défaut au démarrage
export const initializeDatabase = async () => {
  if (mockUsers.length === 0) {
    // 1. Utilisateurs
    mockUsers.push({
      id: 1,
      email: 'admin@mj.com',
      passwordHash: await Security.hashPassword('admin123'),
      first_name: 'Super',
      last_name: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE'
    });

    mockUsers.push({
      id: 2,
      email: 'encadrant@mj.com',
      passwordHash: await Security.hashPassword('encadrant123'),
      first_name: 'Jean',
      last_name: 'Dupont',
      role: 'ENCADRANT',
      status: 'ACTIVE'
    });

    mockUsers.push({
      id: 3,
      email: 'member@mj.com',
      passwordHash: await Security.hashPassword('member123'),
      first_name: 'Amine',
      last_name: 'Alami',
      role: 'MEMBER',
      status: 'ACTIVE'
    });

    // 2. Clubs
    mockClubs.push({
      id: 1,
      name: 'Club Informatique',
      description: 'Découverte de la programmation et du web.',
      encadrant_ids: [2],
      member_ids: [3]
    });
    mockClubs.push({
      id: 2,
      name: 'Club Robotique',
      description: 'Conception et programmation de robots autonomes.',
      encadrant_ids: [2],
      member_ids: []
    });

    // 3. Événements
    mockEvents.push({
      id: 1,
      title: 'Hackathon Al Qods 2026',
      description: '24 heures de code non-stop.',
      event_date: '2026-07-25',
      event_time: '09:00',
      club_id: 1,
      creator_id: 2
    });

    // 4. Publications
    mockPublications.push({
      id: 1,
      text: 'Bienvenue sur la nouvelle plateforme de la Maison des Jeunes !',
      author_id: 1,
      image_urls: []
    });

    // 5. Annonces
    mockAnnouncements.push({
      id: 1,
      title: 'Session spéciale Arduino',
      content: 'Ce samedi à 14h dans la salle Robotique.',
      club_id: 2,
      creator_id: 2
    });

    console.log('[database]: Base de données fictive initialisée avec succès.');
  }
};
