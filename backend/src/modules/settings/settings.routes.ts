import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { updateSettingsSchema } from './settings.dto';

const router = Router();

// Route publique pour récupérer les paramètres (contact, réseaux sociaux, etc.)
router.get('/', SettingsController.getSettings);

// Route réservée à l'Admin
router.put('/', requireAuth, requireRole(['ADMIN']), validateRequest(updateSettingsSchema), SettingsController.updateSettings);

export default router;
