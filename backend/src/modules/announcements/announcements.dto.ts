import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
    content: z.string().min(10, "Le contenu doit faire au moins 10 caractères"),
    club_id: z.number().optional()   // null = annonce globale (sans club)
  })
});

export const updateAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères").optional(),
    content: z.string().min(10, "Le contenu doit faire au moins 10 caractères").optional()
  })
});
