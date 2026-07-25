import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { mockPublications, mockUsers, mockComments, mockInteractions, Publication, Comment, Interaction } from '../../core/database';

export class PublicationsController {
  static getAllPublications(req: AuthenticatedRequest, res: Response) {
    const publications = mockPublications.map(pub => {
      const likes = mockInteractions.filter(i => i.publication_id === pub.id && i.type === 'LIKE').length;
      const dislikes = mockInteractions.filter(i => i.publication_id === pub.id && i.type === 'DISLIKE').length;
      const comments = mockComments.filter(c => c.publication_id === pub.id);

      return {
        ...pub,
        likes,
        dislikes,
        comments
      };
    });

    return res.json(publications);
  }

  static createPublication(req: AuthenticatedRequest, res: Response) {
    const { text } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé." });
    }

    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File) => {
        imageUrls.push(file.path);
      });
    }

    const newPublication: Publication = {
      id: mockPublications.length + 1,
      text,
      author_id: userId,
      image_urls: imageUrls
    };

    mockPublications.push(newPublication);
    return res.status(201).json({ message: "Publication créée avec succès.", publication: newPublication });
  }

  static updatePublication(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const pub = mockPublications.find(p => p.id === id);

    if (!pub) {
      return res.status(404).json({ message: "Publication non trouvée." });
    }

    const { text } = req.body;
    if (text) pub.text = text;

    return res.json({ message: "Publication mise à jour avec succès.", publication: pub });
  }

  static deletePublication(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const index = mockPublications.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Publication non trouvée." });
    }

    mockPublications.splice(index, 1);
    return res.json({ message: "Publication supprimée avec succès." });
  }

  static likePublication(req: AuthenticatedRequest, res: Response) {
    const pubId = parseInt(req.params.id);
    const userId = req.user?.userId;
    const { type } = req.body; // 'LIKE' | 'DISLIKE'

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const pub = mockPublications.find(p => p.id === pubId);
    if (!pub) {
      return res.status(404).json({ message: "Publication non trouvée." });
    }

    // Supprimer l'ancienne interaction de cet utilisateur si elle existe
    const existingIndex = mockInteractions.findIndex(i => i.publication_id === pubId && i.user_id === userId);
    if (existingIndex !== -1) {
      const existing = mockInteractions[existingIndex];
      mockInteractions.splice(existingIndex, 1);
      // Si l'utilisateur clique sur le même bouton, on retire simplement le like/dislike (toggle)
      if (existing.type === type) {
        return res.json({ message: "Vote retiré avec succès." });
      }
    }

    const newInteraction: Interaction = {
      publication_id: pubId,
      user_id: userId,
      type
    };

    mockInteractions.push(newInteraction);
    return res.json({ message: `Vote ${type === 'LIKE' ? 'Ajouté' : 'Retiré'} avec succès.` });
  }

  static commentPublication(req: AuthenticatedRequest, res: Response) {
    const pubId = parseInt(req.params.id);
    const userId = req.user?.userId;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const pub = mockPublications.find(p => p.id === pubId);
    if (!pub) {
      return res.status(404).json({ message: "Publication non trouvée." });
    }

    const user = mockUsers.find(u => u.id === userId);

    const newComment: Comment = {
      id: mockComments.length + 1,
      publication_id: pubId,
      author_id: userId,
      author_name: user ? `${user.first_name} ${user.last_name}` : 'Anonyme',
      content,
      created_at: new Date().toISOString()
    };

    mockComments.push(newComment);
    return res.status(201).json({ message: "Commentaire ajouté.", comment: newComment });
  }
}
