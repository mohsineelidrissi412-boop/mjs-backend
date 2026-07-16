import { Request, Response, NextFunction } from 'express';
import { Security } from '../core/security';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Accès refusé. Token manquant ou mal formé." });
  }

  const token = authHeader.split(' ')[1];
  const decoded = Security.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }

  req.user = {
    userId: decoded.userId,
    role: decoded.role,
  };

  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit. Rôle insuffisant." });
    }

    next();
  };
};
