import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    institution_email: z.string().email("Email invalide").optional(),
    phone_number: z.string().min(8, "Numéro de téléphone trop court").optional(),
    facebook_url: z.string().url("URL Facebook invalide").optional(),
    instagram_url: z.string().url("URL Instagram invalide").optional(),
    location: z.string().min(3, "Localisation trop courte").optional()
  })
});
