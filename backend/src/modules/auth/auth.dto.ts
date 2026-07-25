import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format d'email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères")
  })
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Format d'email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
    first_name: z.string().min(2, "Le prénom est trop court"),
    last_name: z.string().min(2, "Le nom est trop court"),
    role: z.enum(['ADMIN', 'ENCADRANT', 'MEMBER']).default('MEMBER')
  })
});
