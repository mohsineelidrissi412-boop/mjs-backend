import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';
import { upload } from '../../middlewares/upload';

export class SettingsController {
  // ─── GET settings + contacts + slider ────────────────────────
  static async getSettings(req: Request, res: Response) {
    const [settingsResult, contactsResult, sliderResult] = await Promise.all([
      supabase.from('site_settings').select('logo_url, updated_at').eq('id', 1).single(),
      supabase.from('contacts').select('id, type, label, value, order_index').order('order_index'),
      supabase.from('site_slider_images').select('id, image_url, order_index').order('order_index')
    ]);

    return res.json({
      logo_url: settingsResult.data?.logo_url || null,
      contacts: contactsResult.data || [],
      slider_images: sliderResult.data || []
    });
  }

  // ─── PUT update site logo ─────────────────────────────────────
  static async updateLogo(req: AuthenticatedRequest, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie.' });
    }

    const logo_url = `/uploads/${req.file.filename}`;
    const { error } = await supabase
      .from('site_settings')
      .update({ logo_url })
      .eq('id', 1);

    if (error) return res.status(500).json({ message: 'Erreur lors de la mise à jour du logo.' });
    return res.json({ message: 'Logo mis à jour.', logo_url });
  }

  // ─── POST add contact ─────────────────────────────────────────
  static async addContact(req: AuthenticatedRequest, res: Response) {
    const { type, label, value, order_index } = req.body;

    const { data, error } = await supabase
      .from('contacts')
      .insert({ type, label: label || null, value, order_index: order_index || 0 })
      .select()
      .single();

    if (error) return res.status(500).json({ message: "Erreur lors de l'ajout du contact." });
    return res.status(201).json({ message: 'Contact ajouté.', contact: data });
  }

  // ─── PUT update contact ───────────────────────────────────────
  static async updateContact(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { type, label, value, order_index } = req.body;
    const updates: Record<string, any> = {};

    if (type) updates.type = type;
    if (label !== undefined) updates.label = label;
    if (value) updates.value = value;
    if (order_index !== undefined) updates.order_index = order_index;

    const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select().single();
    if (error || !data) return res.status(404).json({ message: 'Contact non trouvé.' });
    return res.json({ message: 'Contact mis à jour.', contact: data });
  }

  // ─── DELETE contact ───────────────────────────────────────────
  static async deleteContact(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) return res.status(404).json({ message: 'Contact non trouvé.' });
    return res.json({ message: 'Contact supprimé.' });
  }

  // ─── POST add slider image ────────────────────────────────────
  static async addSliderImage(req: AuthenticatedRequest, res: Response) {
    if (!req.file) return res.status(400).json({ message: 'Aucune image fournie.' });

    const { order_index } = req.body;
    const image_url = `/uploads/${req.file.filename}`;

    const { data, error } = await supabase
      .from('site_slider_images')
      .insert({ image_url, order_index: order_index ? parseInt(order_index) : 0 })
      .select()
      .single();

    if (error) return res.status(500).json({ message: "Erreur lors de l'ajout de l'image." });
    return res.status(201).json({ message: 'Image ajoutée au slider.', image: data });
  }

  // ─── DELETE slider image ──────────────────────────────────────
  static async deleteSliderImage(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { error } = await supabase.from('site_slider_images').delete().eq('id', id);
    if (error) return res.status(404).json({ message: 'Image non trouvée.' });
    return res.json({ message: 'Image supprimée du slider.' });
  }
}
