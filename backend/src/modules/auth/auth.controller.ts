import { Request, Response } from 'express';
import { Security } from '../../core/security';
import { supabase } from '../../core/database';
import crypto from 'crypto';

export class AuthController {
  // ─── Login ────────────────────────────────────────────────────
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'Votre compte est inactif ou suspendu. Contactez un administrateur.' });
    }

    const isMatch = await Security.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const accessToken = Security.generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = Security.generateRefreshToken({ userId: user.id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        profile_picture_url: user.profile_picture_url
      }
    });
  }

  // ─── Register ─────────────────────────────────────────────────
  static async register(req: Request, res: Response) {
    const { email, password, first_name, last_name, phone, birth_date } = req.body;

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Cet email est déjà enregistré.' });
    }

    const password_hash = await Security.hashPassword(password);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        first_name,
        last_name,
        phone: phone || null,
        birth_date: birth_date || null,
        role: 'MEMBER',
        status: 'PENDING'   // Admin must activate the account
      })
      .select('id, email, first_name, last_name, role, status')
      .single();

    if (error) {
      console.error('[auth] register error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du compte.' });
    }

    return res.status(201).json({
      message: 'Compte créé avec succès. En attente de validation par un administrateur.',
      user: newUser
    });
  }

  // ─── Refresh Token ────────────────────────────────────────────
  static async refreshToken(req: Request, res: Response) {
    const cookies: Record<string, string> = {};
    if (req.headers.cookie) {
      req.headers.cookie.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();
      });
    }

    const token = cookies.refreshToken || req.body.refresh_token;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token manquant.' });
    }

    const decoded = Security.verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Refresh token invalide ou expiré.' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, role, status')
      .eq('id', decoded.userId)
      .single();

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou inactif.' });
    }

    const newAccessToken = Security.generateAccessToken({ userId: user.id, role: user.role });
    return res.json({ access_token: newAccessToken });
  }

  // ─── Logout ───────────────────────────────────────────────────
  static logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    return res.json({ message: 'Déconnexion réussie.' });
  }

  // ─── Forgot Password ──────────────────────────────────────────
  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await supabase.from('password_reset_tokens').insert({
      user_id: user.id,
      token,
      expires_at
    });

    // TODO: Send email with reset link containing the token
    // For now, return the token in development mode so you can test
    const response: any = { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
    if (process.env.NODE_ENV === 'development') {
      response.dev_token = token;
    }

    return res.json(response);
  }

  // ─── Reset Password ───────────────────────────────────────────
  static async resetPassword(req: Request, res: Response) {
    const { token, new_password } = req.body;

    const { data: resetToken } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (!resetToken) {
      return res.status(400).json({ message: 'Token invalide ou déjà utilisé.' });
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Ce lien de réinitialisation a expiré.' });
    }

    const password_hash = await Security.hashPassword(new_password);

    await supabase
      .from('users')
      .update({ password_hash })
      .eq('id', resetToken.user_id);

    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', resetToken.id);

    return res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  }
}
