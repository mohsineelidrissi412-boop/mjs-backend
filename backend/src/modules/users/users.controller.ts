import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';
import { Security } from '../../core/security';

export class UsersController {
  // ─── GET all users (Admin only) ───────────────────────────────
  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    const { role, status } = req.query;

    let query = supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, birth_date, role, status, profile_picture_url, cv_url, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (role) query = query.eq('role', role as string);
    if (status) query = query.eq('status', status as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });

    return res.json(data);
  }

  // ─── GET user by id ───────────────────────────────────────────
  static async getUserById(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, birth_date, role, status, profile_picture_url, cv_url, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    return res.json(user);
  }

  // ─── POST create user (Admin only) ───────────────────────────
  static async createUser(req: AuthenticatedRequest, res: Response) {
    const { email, password, first_name, last_name, role, phone, birth_date } = req.body;

    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });

    const password_hash = await Security.hashPassword(password);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ email, password_hash, first_name, last_name, role, phone: phone || null, birth_date: birth_date || null, status: 'ACTIVE' })
      .select('id, email, first_name, last_name, role, status')
      .single();

    if (error) {
      console.error('[users] createUser error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
    }

    return res.status(201).json(newUser);
  }

  // ─── PUT update user ──────────────────────────────────────────
  static async updateUser(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);

    // Only admin or the user themselves can update
    if (req.user?.role !== 'ADMIN' && req.user?.userId !== id) {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }

    const { first_name, last_name, phone, birth_date, password } = req.body;
    const updates: Record<string, any> = {};

    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;
    if (phone !== undefined) updates.phone = phone;
    if (birth_date !== undefined) updates.birth_date = birth_date;
    if (password) updates.password_hash = await Security.hashPassword(password);

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files['avatar']?.[0]) updates.profile_picture_url = `/uploads/${files['avatar'][0].filename}`;
      if (files['cv']?.[0]) updates.cv_url = `/uploads/${files['cv'][0].filename}`;
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, email, first_name, last_name, phone, birth_date, role, status, profile_picture_url, cv_url')
      .single();

    if (error || !updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    return res.json({ message: 'Profil mis à jour avec succès.', user: updatedUser });
  }

  // ─── PATCH change user status (Admin only) ───────────────────
  static async changeUserStatus(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const { error } = await supabase.from('users').update({ status }).eq('id', id);
    if (error) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    return res.json({ message: `Le statut du compte est désormais ${status}.` });
  }

  // ─── DELETE user (Admin only) ─────────────────────────────────
  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    return res.json({ message: 'Utilisateur supprimé avec succès.' });
  }
}
