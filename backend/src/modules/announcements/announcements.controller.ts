import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';

export class AnnouncementsController {
  // ─── GET all announcements (public) ──────────────────────────
  static async getAllAnnouncements(req: AuthenticatedRequest, res: Response) {
    const { club_id } = req.query;

    let query = supabase
      .from('announcements')
      .select('id, title, content, club_id, creator_id, published_at, created_at, updated_at')
      .order('published_at', { ascending: false });

    if (club_id) query = query.eq('club_id', club_id as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: 'Erreur lors de la récupération des annonces.' });
    return res.json(data);
  }

  // ─── POST create announcement (Admin or Encadrant of the club) ──
  static async createAnnouncement(req: AuthenticatedRequest, res: Response) {
    const { title, content, club_id } = req.body;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) return res.status(401).json({ message: 'Non authentifié.' });

    // If club_id is provided, verify the user is an encadrant of that club (or admin)
    if (club_id && role !== 'ADMIN') {
      const { data: enc } = await supabase
        .from('club_encadrants')
        .select('encadrant_id')
        .eq('club_id', club_id)
        .eq('encadrant_id', userId)
        .single();

      if (!enc) return res.status(403).json({ message: "Vous n'êtes pas autorisé à publier des annonces dans ce club." });
    }

    const { data: newAnnouncement, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        club_id: club_id || null,
        creator_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('[announcements] create error:', error);
      return res.status(500).json({ message: "Erreur lors de la création de l'annonce." });
    }

    return res.status(201).json({ message: 'Annonce publiée avec succès.', announcement: newAnnouncement });
  }

  // ─── PUT update announcement ──────────────────────────────────
  static async updateAnnouncement(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    const { data: announcement } = await supabase
      .from('announcements')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!announcement) return res.status(404).json({ message: 'Annonce non trouvée.' });

    if (role !== 'ADMIN' && announcement.creator_id !== userId) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres annonces.' });
    }

    const { title, content } = req.body;
    const updates: Record<string, any> = {};
    if (title) updates.title = title;
    if (content) updates.content = content;

    const { data: updatedAnnouncement, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: "Erreur lors de la mise à jour." });
    return res.json({ message: 'Annonce mise à jour avec succès.', announcement: updatedAnnouncement });
  }

  // ─── DELETE announcement ──────────────────────────────────────
  static async deleteAnnouncement(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    const { data: announcement } = await supabase
      .from('announcements')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!announcement) return res.status(404).json({ message: 'Annonce non trouvée.' });

    if (role !== 'ADMIN' && announcement.creator_id !== userId) {
      return res.status(403).json({ message: "Vous n'avez pas l'autorisation de supprimer cette annonce." });
    }

    await supabase.from('announcements').delete().eq('id', id);
    return res.json({ message: 'Annonce supprimée avec succès.' });
  }
}
