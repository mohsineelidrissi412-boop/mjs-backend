import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';

export class PassJeunesController {
  // ─── GET all services (public) ────────────────────────────────
  static async getAllServices(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('pass_jeunes_services')
      .select(`
        id, service_name, description, created_at, updated_at,
        pass_jeunes_images (id, image_url, order_index)
      `)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ message: 'Erreur lors de la récupération des services.' });
    return res.json(data);
  }

  // ─── GET single service ───────────────────────────────────────
  static async getServiceById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const { data, error } = await supabase
      .from('pass_jeunes_services')
      .select(`
        id, service_name, description, created_at, updated_at,
        pass_jeunes_images (id, image_url, order_index)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ message: 'Service non trouvé.' });
    return res.json(data);
  }

  // ─── POST create service (Admin only) ────────────────────────
  static async createService(req: AuthenticatedRequest, res: Response) {
    const { service_name, description } = req.body;

    const { data: newService, error } = await supabase
      .from('pass_jeunes_services')
      .insert({ service_name, description })
      .select()
      .single();

    if (error) {
      console.error('[pass-jeunes] create error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du service.' });
    }

    // Insert images if any
    if (req.files && Array.isArray(req.files)) {
      const images = (req.files as Express.Multer.File[]).map((f, i) => ({
        service_id: newService.id,
        image_url: `/uploads/${f.filename}`,
        order_index: i
      }));
      await supabase.from('pass_jeunes_images').insert(images);
    }

    return res.status(201).json({ message: 'Service créé avec succès.', service: newService });
  }

  // ─── PUT update service (Admin only) ─────────────────────────
  static async updateService(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { service_name, description } = req.body;
    const updates: Record<string, any> = {};

    if (service_name) updates.service_name = service_name;
    if (description) updates.description = description;

    const { data, error } = await supabase
      .from('pass_jeunes_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Service non trouvé.' });
    return res.json({ message: 'Service mis à jour.', service: data });
  }

  // ─── DELETE service (Admin only) ──────────────────────────────
  static async deleteService(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { error } = await supabase.from('pass_jeunes_services').delete().eq('id', id);
    if (error) return res.status(404).json({ message: 'Service non trouvé.' });
    return res.json({ message: 'Service supprimé.' });
  }
}
