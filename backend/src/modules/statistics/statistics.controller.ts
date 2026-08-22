import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';

export class StatisticsController {
  // ─── GET admin-level stats ────────────────────────────────────
  static async getAdminStats(req: AuthenticatedRequest, res: Response) {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0];

    const [membersResult, clubsResult, newsResult, eventsResult, pendingUsersResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'MEMBER').eq('status', 'ACTIVE'),
      supabase.from('clubs').select('id', { count: 'exact', head: true }),
      supabase.from('news').select('id', { count: 'exact', head: true }),
      supabase.from('events')
        .select('id', { count: 'exact', head: true })
        .gte('event_date', firstOfMonth)
        .lt('event_date', firstOfNextMonth),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('status', 'PENDING')
    ]);

    return res.json({
      membersCount: membersResult.count || 0,
      clubsCount: clubsResult.count || 0,
      newsCount: newsResult.count || 0,
      monthlyEvents: eventsResult.count || 0,
      pendingUsersCount: pendingUsersResult.count || 0
    });
  }

  // ─── GET encadrant-level stats ────────────────────────────────
  static async getEncadrantStats(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Non autorisé.' });

    const [clubsResult, eventsResult, announcementsResult, pendingRequestsResult] = await Promise.all([
      supabase.from('club_encadrants').select('club_id', { count: 'exact', head: true }).eq('encadrant_id', userId),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('creator_id', userId),
      supabase.from('announcements').select('id', { count: 'exact', head: true }).eq('creator_id', userId),
      // Count pending join requests for clubs this encadrant supervises
      supabase
        .from('join_requests')
        .select('id, clubs!inner(club_encadrants!inner(encadrant_id))', { count: 'exact', head: true })
        .eq('status', 'PENDING')
        .eq('clubs.club_encadrants.encadrant_id', userId)
    ]);

    return res.json({
      supervisedClubsCount: clubsResult.count || 0,
      createdEventsCount: eventsResult.count || 0,
      announcementsCount: announcementsResult.count || 0,
      pendingJoinRequestsCount: pendingRequestsResult.count || 0
    });
  }
}
