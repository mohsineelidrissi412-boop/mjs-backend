import { z } from 'zod';

export const createClubSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Le nom du club doit faire au moins 3 caractères"),
    description: z.string().min(10, "La description doit faire au moins 10 caractères")
  })
});

export const assignEncadrantSchema = z.object({
  body: z.object({
    encadrant_id: z.number({ required_error: "L'identifiant de l'encadrant est requis" })
  })
});

export const handleJoinSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED'])
  })
});
