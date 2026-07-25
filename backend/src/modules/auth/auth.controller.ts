import { Request, Response } from 'express';
import { Security } from '../../core/security';
import { mockUsers, User } from '../../core/database';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: "Votre compte est inactif ou suspendu." });
    }

    const isMatch = await Security.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const accessToken = Security.generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = Security.generateRefreshToken({ userId: user.id });

    // Écrire le refresh token dans un cookie sécurisé
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    return res.json({
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  }

  static async register(req: Request, res: Response) {
    const { email, password, first_name, last_name, role } = req.body;

    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ message: "Cet email est déjà enregistré." });
    }

    const passwordHash = await Security.hashPassword(password);

    const newUser: User = {
      id: mockUsers.length + 1,
      email,
      passwordHash,
      first_name,
      last_name,
      role: role || 'MEMBER',
      status: 'ACTIVE'
    };

    mockUsers.push(newUser);

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès.",
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role
      }
    });
  }

  static async refreshToken(req: Request, res: Response) {
    // Parser les cookies manuellement si cookie-parser n'est pas utilisé
    const cookies: Record<string, string> = {};
    if (req.headers.cookie) {
      req.headers.cookie.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();
      });
    }

    const token = cookies.refreshToken || req.body.refresh_token;

    if (!token) {
      return res.status(401).json({ message: "Refresh token manquant." });
    }

    const decoded = Security.verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Refresh token invalide ou expiré." });
    }

    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ message: "Utilisateur non trouvé ou inactif." });
    }

    const newAccessToken = Security.generateAccessToken({ userId: user.id, role: user.role });

    return res.json({ access_token: newAccessToken });
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    return res.json({ message: "Déconnexion réussie." });
  }
}
