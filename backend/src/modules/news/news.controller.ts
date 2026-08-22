import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { supabase } from '../../core/database';

export class NewsController {
  // ─── GET all news (public) ────────────────────────────────────
  static async getAllNews(req: AuthenticatedRequest, res: Response) {
    const { data, error } = await supabase
      .from('news')
      .select(`
        id, title, content, author_id, published_at, share_count, created_at, updated_at,
        news_images (id, image_url, order_index),
        comments (id, author_id, content, created_at),
        news_likes (user_id)
      `)
      .order('published_at', { ascending: false });

    if (error) return res.status(500).json({ message: 'Erreur lors de la récupération des actualités.' });

    // Add likes count to each news item
    const result = (data || []).map((item: any) => ({
      ...item,
      likes_count: item.news_likes?.length || 0,
      comments_count: item.comments?.length || 0
    }));

    return res.json(result);
  }

  // ─── GET single news by id ────────────────────────────────────
  static async getNewsById(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);

    const { data, error } = await supabase
      .from('news')
      .select(`
        id, title, content, author_id, published_at, share_count, created_at, updated_at,
        news_images (id, image_url, order_index),
        comments (id, author_id, content, created_at),
        news_likes (user_id)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ message: 'Actualité non trouvée.' });

    return res.json({
      ...data,
      likes_count: (data as any).news_likes?.length || 0,
      comments_count: (data as any).comments?.length || 0
    });
  }

  // ─── POST create news (Admin only) ───────────────────────────
  static async createNews(req: AuthenticatedRequest, res: Response) {
    const { title, content } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: 'Non autorisé.' });

    const { data: newNews, error } = await supabase
      .from('news')
      .insert({ title, content, author_id: userId })
      .select()
      .single();

    if (error) {
      console.error('[news] createNews error:', error);
      return res.status(500).json({ message: "Erreur lors de la création de l'actualité." });
    }

    // Insert images if any
    if (req.files && Array.isArray(req.files)) {
      const images = (req.files as Express.Multer.File[]).map((f, i) => ({
        news_id: newNews.id,
        image_url: `/uploads/${f.filename}`,
        order_index: i
      }));
      await supabase.from('news_images').insert(images);
    }

    return res.status(201).json({ message: 'Actualité créée avec succès.', news: newNews });
  }

  // ─── PUT update news (Admin only) ─────────────────────────────
  static async updateNews(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const updates: Record<string, any> = {};

    if (title) updates.title = title;
    if (content) updates.content = content;

    const { data: updatedNews, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedNews) return res.status(404).json({ message: 'Actualité non trouvée.' });
    return res.json({ message: 'Actualité mise à jour avec succès.', news: updatedNews });
  }

  // ─── DELETE news (Admin only) ─────────────────────────────────
  static async deleteNews(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) return res.status(404).json({ message: 'Actualité non trouvée.' });
    return res.json({ message: 'Actualité supprimée avec succès.' });
  }

  // ─── POST toggle like on a news item ─────────────────────────
  static async toggleLike(req: AuthenticatedRequest, res: Response) {
    const news_id = parseInt(req.params.id);
    const user_id = req.user?.userId;

    if (!user_id) return res.status(401).json({ message: 'Non autorisé.' });

    const { data: news } = await supabase.from('news').select('id').eq('id', news_id).single();
    if (!news) return res.status(404).json({ message: 'Actualité non trouvée.' });

    // Check if already liked
    const { data: existing } = await supabase
      .from('news_likes')
      .select('news_id')
      .eq('news_id', news_id)
      .eq('user_id', user_id)
      .single();

    if (existing) {
      // Remove like (toggle off)
      await supabase.from('news_likes').delete().eq('news_id', news_id).eq('user_id', user_id);
      return res.json({ message: 'Like retiré.', liked: false });
    } else {
      // Add like
      await supabase.from('news_likes').insert({ news_id, user_id });
      return res.json({ message: 'Like ajouté.', liked: true });
    }
  }

  // ─── POST increment share count ───────────────────────────────
  static async shareNews(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);

    // Use Supabase RPC to atomically increment share_count
    const { error } = await supabase.rpc('increment_share_count', { news_id: id });

    if (error) {
      // Fallback: manually fetch and update
      const { data: current } = await supabase.from('news').select('share_count').eq('id', id).single();
      if (!current) return res.status(404).json({ message: 'Actualité non trouvée.' });
      await supabase.from('news').update({ share_count: (current.share_count || 0) + 1 }).eq('id', id);
    }

    return res.json({ message: 'Partage enregistré.' });
  }

  // ─── POST add comment to news ─────────────────────────────────
  static async addComment(req: AuthenticatedRequest, res: Response) {
    const news_id = parseInt(req.params.id);
    const author_id = req.user?.userId;
    const { content } = req.body;

    if (!author_id) return res.status(401).json({ message: 'Non autorisé.' });

    const { data: news } = await supabase.from('news').select('id').eq('id', news_id).single();
    if (!news) return res.status(404).json({ message: 'Actualité non trouvée.' });

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({ news_id, author_id, content })
      .select()
      .single();

    if (error) return res.status(500).json({ message: "Erreur lors de l'ajout du commentaire." });
    return res.status(201).json({ message: 'Commentaire ajouté.', comment: newComment });
  }

  // ─── DELETE comment ───────────────────────────────────────────
  static async deleteComment(req: AuthenticatedRequest, res: Response) {
    const commentId = parseInt(req.params.commentId);
    const userId = req.user?.userId;
    const role = req.user?.role;

    const { data: comment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (!comment) return res.status(404).json({ message: 'Commentaire non trouvé.' });

    if (role !== 'ADMIN' && comment.author_id !== userId) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que vos propres commentaires." });
    }

    await supabase.from('comments').delete().eq('id', commentId);
    return res.json({ message: 'Commentaire supprimé.' });
  }
}
