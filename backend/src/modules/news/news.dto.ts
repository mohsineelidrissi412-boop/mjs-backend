import { z } from 'zod';

export const createNewsSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
    content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères.')
  })
});

export const commentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Le commentaire ne peut pas être vide.')
  })
});
