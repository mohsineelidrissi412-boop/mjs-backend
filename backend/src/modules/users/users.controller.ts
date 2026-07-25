import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { mockUsers, User } from '../../core/database';
import { Security } from '../../core/security';

export class UsersController {
  static getAllUsers(req: AuthenticatedRequest, res: Response) {
    const { role, status } = req.query;
    let users = mockUsers;

    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (status) {
      users = users.filter(u => u.status === status);
    }

    // Retourner les profils sans les hashes des mots de passe
    const sanitizedUsers = users.map(({ passwordHash, ...u }) => u);
    return res.json(sanitizedUsers);
  }

  static getUserById(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const { passwordHash, ...sanitizedUser } = user;
    return res.json(sanitizedUser);
  }

  static async createUser(req: AuthenticatedRequest, res: Response) {
    const { email, password, first_name, last_name, role } = req.body;

    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const passwordHash = await Security.hashPassword(password);
    const newUser: User = {
      id: mockUsers.length + 1,
      email,
      passwordHash,
      first_name,
      last_name,
      role,
      status: 'ACTIVE'
    };

    mockUsers.push(newUser);
    const { passwordHash: _, ...sanitized } = newUser;
    return res.status(201).json(sanitized);
  }

  static async updateUser(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier les permissions (Admin ou propriétaire)
    if (req.user?.role !== 'ADMIN' && req.user?.userId !== id) {
      return res.status(403).json({ message: "Action non autorisée." });
    }

    const { first_name, last_name, password } = req.body;

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (password) {
      user.passwordHash = await Security.hashPassword(password);
    }

    // Gérer les uploads de fichiers s'ils sont présents
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files['avatar'] && files['avatar'][0]) {
        user.profile_picture_url = files['avatar'][0].path;
      }
      if (files['cv'] && files['cv'][0]) {
        user.cv_url = files['cv'][0].path;
      }
    }

    const { passwordHash, ...sanitized } = user;
    return res.json({ message: "Profil mis à jour avec succès.", user: sanitized });
  }

  static changeUserStatus(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    user.status = status;
    return res.json({ message: `Le statut du compte est désormais ${status}.` });
  }

  static deleteUser(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const index = mockUsers.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    mockUsers.splice(index, 1);
    return res.json({ message: "Utilisateur supprimé avec succès." });
  }
}
