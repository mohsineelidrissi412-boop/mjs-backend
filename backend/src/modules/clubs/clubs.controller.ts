import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';

export class ClubsController {
  // ─── GET all clubs (public) ───────────────────────────────────
  static async getAllClubs(req: AuthenticatedRequest, res: Response) {
    const { data: clubs, error } = await supabase
      .from('clubs')
      .select(`
        id, name, description, created_at, updated_at,
        club_images (id, image_url, order_index),
        club_encadrants (encadrant_id),
        club_members (member_id)
      `)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: 'Erreur lors de la récupération des clubs.' });
    return res.json(clubs);
  }

  // ─── GET club by id ───────────────────────────────────────────
  static async getClubById(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    const { data: club, error } = await supabase
      .from('clubs')
      .select(`
        id, name, description, created_at, updated_at,
        club_images (id, image_url, order_index),
        club_encadrants (encadrant_id),
        club_members (member_id)
      `)
      .eq('id', id)
      .single();

    if (error || !club) return res.status(404).json({ message: 'Club non trouvé.' });

    // Encadrant can only access their own clubs
    if (role === 'ENCADRANT' && userId) {
      const encadrantIds = (club.club_encadrants as any[]).map((e: any) => e.encadrant_id);
      if (!encadrantIds.includes(userId)) {
        return res.status(403).json({ message: "Accès refusé. Vous n'encadrez pas ce club." });
      }
    }

    const { data: joinRequests } = await supabase
      .from('join_requests')
      .select('id, user_id, status, created_at')
      .eq('club_id', id);

    return res.json({ ...club, join_requests: joinRequests || [] });
  }

  // ─── POST create club (Admin only) ───────────────────────────
  static async createClub(req: AuthenticatedRequest, res: Response) {
    const { name, description } = req.body;

    const { data: newClub, error } = await supabase
      .from('clubs')
      .insert({ name, description })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Un club portant ce nom existe déjà.' });
      }
      console.error('[clubs] createClub error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du club.' });
    }

    // If images uploaded, insert them
    if (req.files && Array.isArray(req.files)) {
      const images = (req.files as Express.Multer.File[]).map((f, i) => ({
        club_id: newClub.id,
        image_url: `/uploads/${f.filename}`,
        order_index: i
      }));
      await supabase.from('club_images').insert(images);
    }

    return res.status(201).json(newClub);
  }

  // ─── PUT update club (Admin only) ─────────────────────────────
  static async updateClub(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const updates: Record<string, any> = {};

    if (name) updates.name = name;
    if (description) updates.description = description;

    const { data: updatedClub, error } = await supabase
      .from('clubs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedClub) return res.status(404).json({ message: 'Club non trouvé.' });

    // If new images uploaded, append them
    if (req.files && Array.isArray(req.files)) {
      const { data: existing } = await supabase
        .from('club_images')
        .select('order_index')
        .eq('club_id', id)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 0;
      const images = (req.files as Express.Multer.File[]).map((f, i) => ({
        club_id: id,
        image_url: `/uploads/${f.filename}`,
        order_index: nextIndex + i
      }));
      await supabase.from('club_images').insert(images);
    }

    return res.json({ message: 'Club mis à jour avec succès.', club: updatedClub });
  }

  // ─── DELETE club (Admin only) ─────────────────────────────────
  static async deleteClub(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { error } = await supabase.from('clubs').delete().eq('id', id);
    if (error) return res.status(404).json({ message: 'Club non trouvé.' });
    return res.json({ message: 'Club supprimé avec succès.' });
  }

  // ─── POST assign encadrant to club (Admin only) ───────────────
  static async assignEncadrant(req: AuthenticatedRequest, res: Response) {
    const club_id = parseInt(req.params.id);
    const { encadrant_id } = req.body;

    // Verify club exists
    const { data: club } = await supabase.from('clubs').select('id').eq('id', club_id).single();
    if (!club) return res.status(404).json({ message: 'Club non trouvé.' });

    // Verify encadrant exists and has correct role
    const { data: encadrant } = await supabase
      .from('users')
      .select('id')
      .eq('id', encadrant_id)
      .eq('role', 'ENCADRANT')
      .single();

    if (!encadrant) return res.status(400).json({ message: "L'utilisateur spécifié n'existe pas ou n'est pas un encadrant." });

    const { error } = await supabase
      .from('club_encadrants')
      .upsert({ club_id, encadrant_id }, { onConflict: 'club_id,encadrant_id' });

    if (error) return res.status(500).json({ message: "Erreur lors de l'assignation de l'encadrant." });

    return res.json({ message: 'Encadrant assigné au club avec succès.' });
  }

  // ─── POST member requests to join a club ──────────────────────
  static async joinClub(req: AuthenticatedRequest, res: Response) {
    const club_id = parseInt(req.params.id);
    const user_id = req.user?.userId;

    if (!user_id) return res.status(401).json({ message: 'Non authentifié.' });

    // Check club exists
    const { data: club } = await supabase.from('clubs').select('id').eq('id', club_id).single();
    if (!club) return res.status(404).json({ message: 'Club non trouvé.' });

    // Check already a member
    const { data: membership } = await supabase
      .from('club_members')
      .select('member_id')
      .eq('club_id', club_id)
      .eq('member_id', user_id)
      .single();

    if (membership) return res.status(400).json({ message: 'Vous êtes déjà membre de ce club.' });

    // Check pending request already exists
    const { data: existingReq } = await supabase
      .from('join_requests')
      .select('id')
      .eq('club_id', club_id)
      .eq('user_id', user_id)
      .eq('status', 'PENDING')
      .single();

    if (existingReq) return res.status(400).json({ message: "Vous avez déjà une demande d'adhésion en cours pour ce club." });

    const { data: newRequest, error } = await supabase
      .from('join_requests')
      .insert({ club_id, user_id, status: 'PENDING' })
      .select()
      .single();

    if (error) return res.status(500).json({ message: "Erreur lors de l'envoi de la demande." });

    return res.status(201).json({ message: "Demande d'adhésion envoyée avec succès.", request: newRequest });
  }

  // ─── PATCH approve or reject a join request ───────────────────
  static async handleJoinRequest(req: AuthenticatedRequest, res: Response) {
    const club_id = parseInt(req.params.id);
    const user_id = parseInt(req.params.userId);
    const { status } = req.body; // 'APPROVED' | 'REJECTED'

    const role = req.user?.role;
    const currentUserId = req.user?.userId;

    // Encadrant can only manage their own clubs
    if (role === 'ENCADRANT' && currentUserId) {
      const { data: enc } = await supabase
        .from('club_encadrants')
        .select('encadrant_id')
        .eq('club_id', club_id)
        .eq('encadrant_id', currentUserId)
        .single();

      if (!enc) return res.status(403).json({ message: "Vous n'avez pas l'autorisation de gérer les adhésions de ce club." });
    }

    // Update the join request
    const { data: updated, error } = await supabase
      .from('join_requests')
      .update({ status })
      .eq('club_id', club_id)
      .eq('user_id', user_id)
      .eq('status', 'PENDING')
      .select()
      .single();

    if (error || !updated) return res.status(404).json({ message: "Demande d'adhésion non trouvée." });

    // If approved, add to club_members
    if (status === 'APPROVED') {
      await supabase
        .from('club_members')
        .upsert({ club_id, member_id: user_id }, { onConflict: 'club_id,member_id' });
    }

    return res.json({ message: `La demande a été ${status === 'APPROVED' ? 'acceptée' : 'refusée'} avec succès.` });
  }
}
