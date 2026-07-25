import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { mockClubs, mockUsers, mockJoinRequests, Club, JoinRequest } from '../../core/database';

export class ClubsController {
  static getAllClubs(req: AuthenticatedRequest, res: Response) {
    return res.json(mockClubs);
  }

  static getClubById(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const club = mockClubs.find(c => c.id === id);

    if (!club) {
      return res.status(404).json({ message: "Club non trouvé." });
    }

    const userId = req.user?.userId;
    const role = req.user?.role;

    // L'encadrant ne peut accéder qu'à ses propres clubs
    if (role === 'ENCADRANT' && userId && !club.encadrant_ids.includes(userId)) {
      return res.status(403).json({ message: "Accès refusé. Vous n'encadrez pas ce club." });
    }

    // Récupérer les requêtes d'adhésion en attente pour ce club
    const joinRequests = mockJoinRequests.filter(r => r.club_id === id);

    return res.json({
      ...club,
      join_requests: joinRequests
    });
  }

  static createClub(req: AuthenticatedRequest, res: Response) {
    const { name, description } = req.body;

    const exists = mockClubs.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: "Un club portant ce nom existe déjà." });
    }

    const newClub: Club = {
      id: mockClubs.length + 1,
      name,
      description,
      logo_url: req.file ? req.file.path : undefined,
      encadrant_ids: [],
      member_ids: []
    };

    mockClubs.push(newClub);
    return res.status(201).json(newClub);
  }

  static updateClub(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const club = mockClubs.find(c => c.id === id);

    if (!club) {
      return res.status(404).json({ message: "Club non trouvé." });
    }

    const { name, description } = req.body;

    if (name) club.name = name;
    if (description) club.description = description;
    if (req.file) {
      club.logo_url = req.file.path;
    }

    return res.json({ message: "Club mis à jour avec succès.", club });
  }

  static deleteClub(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const index = mockClubs.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Club non trouvé." });
    }

    mockClubs.splice(index, 1);
    return res.json({ message: "Club supprimé avec succès." });
  }

  static assignEncadrant(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { encadrant_id } = req.body;

    const club = mockClubs.find(c => c.id === id);
    if (!club) {
      return res.status(404).json({ message: "Club non trouvé." });
    }

    const encadrant = mockUsers.find(u => u.id === encadrant_id && u.role === 'ENCADRANT');
    if (!encadrant) {
      return res.status(400).json({ message: "L'utilisateur spécifié n'existe pas ou n'est pas un encadrant." });
    }

    if (!club.encadrant_ids.includes(encadrant_id)) {
      club.encadrant_ids.push(encadrant_id);
    }

    return res.json({ message: "Encadrant assigné au club avec succès.", club });
  }

  static joinClub(req: AuthenticatedRequest, res: Response) {
    const clubId = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    const club = mockClubs.find(c => c.id === clubId);
    if (!club) {
      return res.status(404).json({ message: "Club non trouvé." });
    }

    if (club.member_ids.includes(userId)) {
      return res.status(400).json({ message: "Vous êtes déjà membre de ce club." });
    }

    const existingRequest = mockJoinRequests.find(r => r.club_id === clubId && r.user_id === userId && r.status === 'PENDING');
    if (existingRequest) {
      return res.status(400).json({ message: "Vous avez déjà une demande d'adhésion en cours pour ce club." });
    }

    const newRequest: JoinRequest = {
      id: mockJoinRequests.length + 1,
      club_id: clubId,
      user_id: userId,
      status: 'PENDING'
    };

    mockJoinRequests.push(newRequest);
    return res.status(201).json({ message: "Demande d'adhésion envoyée avec succès.", request: newRequest });
  }

  static handleJoinRequest(req: AuthenticatedRequest, res: Response) {
    const clubId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    const { status } = req.body; // 'APPROVED' | 'REJECTED'

    const club = mockClubs.find(c => c.id === clubId);
    if (!club) {
      return res.status(404).json({ message: "Club non trouvé." });
    }

    const role = req.user?.role;
    const currentUserId = req.user?.userId;

    // Si encadrant, vérifier qu'il gère ce club
    if (role === 'ENCADRANT' && currentUserId && !club.encadrant_ids.includes(currentUserId)) {
      return res.status(403).json({ message: "Vous n'avez pas l'autorisation de gérer les adhésions de ce club." });
    }

    const joinRequest = mockJoinRequests.find(r => r.club_id === clubId && r.user_id === userId && r.status === 'PENDING');
    if (!joinRequest) {
      return res.status(404).json({ message: "Demande d'adhésion non trouvée." });
    }

    joinRequest.status = status;

    if (status === 'APPROVED') {
      if (!club.member_ids.includes(userId)) {
        club.member_ids.push(userId);
      }
    }

    return res.json({ message: `La demande a été ${status === 'APPROVED' ? 'acceptée' : 'refusée'} avec succès.` });
  }
}
