import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { mockUsers, mockClubs, mockEvents, mockPublications, mockAnnouncements } from '../../core/database';

export class StatisticsController {
  static getAdminStats(req: AuthenticatedRequest, res: Response) {
    const membersCount = mockUsers.filter(u => u.role === 'MEMBER').length;
    const clubsCount = mockClubs.length;
    const publicationsCount = mockPublications.length;

    // Calculer les événements de ce mois (Juillet 2026 dans notre contexte de simulation)
    const currentMonth = '2026-07';
    const monthlyEvents = mockEvents.filter(e => e.event_date.startsWith(currentMonth)).length;

    return res.json({
      membersCount,
      clubsCount,
      monthlyEvents,
      publicationsCount
    });
  }

  static getEncadrantStats(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const supervisedClubsCount = mockClubs.filter(c => c.encadrant_ids.includes(userId)).length;
    const createdEventsCount = mockEvents.filter(e => e.creator_id === userId).length;
    const announcementsCount = mockAnnouncements.filter(a => a.creator_id === userId).length;

    return res.json({
      supervisedClubsCount,
      createdEventsCount,
      announcementsCount
    });
  }
}
