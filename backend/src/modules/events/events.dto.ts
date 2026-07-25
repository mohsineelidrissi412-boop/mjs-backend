import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
    description: z.string().min(10, "La description doit faire au moins 10 caractères"),
    event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date requis : AAAA-MM-JJ"),
    event_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure requis : HH:MM"),
    club_id: z.number().optional()
  })
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères").optional(),
    description: z.string().min(10, "La description doit faire au moins 10 caractères").optional(),
    event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date requis : AAAA-MM-JJ").optional(),
    event_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure requis : HH:MM").optional()
  })
});
