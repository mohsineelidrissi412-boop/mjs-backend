import { z } from 'zod';

export const createPublicationSchema = z.object({
  body: z.object({
    text: z.string().min(1, "Le texte de la publication ne peut pas être vide")
  })
});

export const likePublicationSchema = z.object({
  body: z.object({
    type: z.enum(['LIKE', 'DISLIKE'])
  })
});

export const commentPublicationSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Le commentaire ne peut pas être vide")
  })
});
