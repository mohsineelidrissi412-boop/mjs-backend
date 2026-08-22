import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';

export class EventsController {
  // ─── GET all events (public) ──────────────────────────────────
  static async getAllEvents(req: AuthenticatedRequest, res: Response) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id, title, description, event_date, event_time, club_id, creator_id, created_at, updated_at,
        event_images (id, image_url, order_index)
      `)
      .order('event_date', { ascending: true });

    if (error) return res.status(500).json({ message: 'Erreur lors de la récupération des événements.' });
    return res.json(data);
  }

  // ─── POST create event ────────────────────────────────────────
  static async createEvent(req: AuthenticatedRequest, res: Response) {
    const { title, description, event_date, event_time, club_id } = req.body;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) return res.status(401).json({ message: 'Non authentifié.' });

    // Encadrant must associate with one of their clubs
    if (role === 'ENCADRANT') {
      if (!club_id) return res.status(400).json({ message: "Un encadrant doit associer l'événement à un club." });

      const { data: enc } = await supabase
        .from('club_encadrants')
        .select('encadrant_id')
        .eq('club_id', club_id)
        .eq('encadrant_id', userId)
        .single();

      if (!enc) return res.status(403).json({ message: "Vous n'avez pas l'autorisation de créer des événements pour ce club." });
    }

    const { data: newEvent, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        event_date,
        event_time,
        club_id: club_id ? parseInt(club_id) : null,
        creator_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('[events] createEvent error:', error);
      return res.status(500).json({ message: "Erreur lors de la création de l'événement." });
    }

    // Insert event images if any
    if (req.files && Array.isArray(req.files)) {
      const images = (req.files as Express.Multer.File[]).map((f, i) => ({
        event_id: newEvent.id,
        image_url: `/uploads/${f.filename}`,
        order_index: i
      }));
      await supabase.from('event_images').insert(images);
    }

    return res.status(201).json({ message: 'Événement créé avec succès.', event: newEvent });
  }

  // ─── PUT update event ─────────────────────────────────────────
  static async updateEvent(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    const { data: event } = await supabase.from('events').select('creator_id').eq('id', id).single();
    if (!event) return res.status(404).json({ message: 'Événement non trouvé.' });

    if (role === 'ENCADRANT' && event.creator_id !== userId) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que les événements que vous avez créés.' });
    }

    const { title, description, event_date, event_time } = req.body;
    const updates: Record<string, any> = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (event_date) updates.event_date = event_date;
    if (event_time) updates.event_time = event_time;

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: "Erreur lors de la mise à jour de l'événement." });
    return res.json({ message: 'Événement mis à jour avec succès.', event: updatedEvent });
  }

  // ─── DELETE event ─────────────────────────────────────────────
  static async deleteEvent(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    const { data: event } = await supabase.from('events').select('creator_id').eq('id', id).single();
    if (!event) return res.status(404).json({ message: 'Événement non trouvé.' });

    if (role === 'ENCADRANT' && event.creator_id !== userId) {
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que les événements que vous avez créés.' });
    }

    await supabase.from('events').delete().eq('id', id);
    return res.json({ message: 'Événement supprimé avec succès.' });
  }
}
