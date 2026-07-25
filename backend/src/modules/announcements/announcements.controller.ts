import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { mockAnnouncements, mockClubs, Announcement } from '../../core/database';

export class AnnouncementsController {
  static createAnnouncement(req: AuthenticatedRequest, res: Response) {
    const { title, content, club_id } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    const club = mockClubs.find(c => c.id === club_id);
    if (!club) {
      return res.status(404).json({ message: "Club non trouvé." });
    }

    // Un encadrant ne peut publier que dans ses propres clubs
    if (!club.encadrant_ids.includes(userId)) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à publier des annonces dans ce club." });
    }

    const newAnnouncement: Announcement = {
      id: mockAnnouncements.length + 1,
      title,
      content,
      club_id,
      creator_id: userId
    };

    mockAnnouncements.push(newAnnouncement);
    return res.status(201).json({ message: "Annonce publiée avec succès.", announcement: newAnnouncement });
  }

  static updateAnnouncement(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const announcement = mockAnnouncements.find(a => a.id === id);

    if (!announcement) {
      return res.status(404).json({ message: "Annonce non trouvée." });
    }

    const userId = req.user?.userId;

    // Seul le créateur de l'annonce peut la modifier
    if (announcement.creator_id !== userId) {
      return res.status(403).json({ message: "Vous ne pouvez modifier que vos propres annonces." });
    }

    const { title, content } = req.body;

    if (title) announcement.title = title;
    if (content) announcement.content = content;

    return res.json({ message: "Annonce mise à jour avec succès.", announcement });
  }

  static deleteAnnouncement(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const index = mockAnnouncements.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Annonce non trouvée." });
    }

    const announcement = mockAnnouncements[index];
    const userId = req.user?.userId;
    const role = req.user?.role;

    // L'encadrant créateur ou un administrateur peut supprimer
    if (role !== 'ADMIN' && announcement.creator_id !== userId) {
      return res.status(403).json({ message: "Vous n'avez pas l'autorisation de supprimer cette annonce." });
    }

    mockAnnouncements.splice(index, 1);
    return res.json({ message: "Annonce supprimée avec succès." });
  }
}
