import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ [database] SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant dans le fichier .env');
  console.error('   → Ouvre backend/.env et remplis SUPABASE_URL et SUPABASE_SERVICE_KEY\n');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

console.log('[database] Client Supabase initialisé avec succès.');

// ─── TypeScript Interfaces (aligned with Supabase schema) ─────

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  birth_date?: string;
  role: 'ADMIN' | 'ENCADRANT' | 'MEMBER';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  profile_picture_url?: string;
  cv_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClubImage {
  id: number;
  club_id: number;
  image_url: string;
  order_index: number;
}

export interface ClubEncadrant {
  club_id: number;
  encadrant_id: number;
  assigned_at?: string;
}

export interface ClubMember {
  club_id: number;
  member_id: number;
  joined_at?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  club_id?: number;
  creator_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventImage {
  id: number;
  event_id: number;
  image_url: string;
  order_index: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published_at?: string;
  share_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewsImage {
  id: number;
  news_id: number;
  image_url: string;
  order_index: number;
}

export interface Comment {
  id: number;
  news_id: number;
  author_id: number;
  content: string;
  created_at?: string;
}

export interface NewsLike {
  news_id: number;
  user_id: number;
  created_at?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  club_id?: number;
  creator_id: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JoinRequest {
  id: number;
  club_id: number;
  user_id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: number;
  logo_url?: string;
  updated_at?: string;
}

export interface SiteSliderImage {
  id: number;
  image_url: string;
  order_index: number;
  created_at?: string;
}

export interface Contact {
  id: number;
  type: 'PHONE' | 'EMAIL' | 'ADDRESS' | 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'OTHER';
  label?: string;
  value: string;
  order_index: number;
  created_at?: string;
}

export interface PassJeunesService {
  id: number;
  service_name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface PassJeunesImage {
  id: number;
  service_id: number;
  image_url: string;
  order_index: number;
}

export interface PasswordResetToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  used: boolean;
  created_at?: string;
}
