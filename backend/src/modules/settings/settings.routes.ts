import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';

const router = Router();

// Public GET — returns logo + contacts + slider images
router.get('/', SettingsController.getSettings);

// Admin only — Logo
router.put('/logo', requireAuth, requireRole(['ADMIN']), upload.single('logo'), SettingsController.updateLogo);

// Admin only — Contacts
router.post('/contacts', requireAuth, requireRole(['ADMIN']), SettingsController.addContact);
router.put('/contacts/:id', requireAuth, requireRole(['ADMIN']), SettingsController.updateContact);
router.delete('/contacts/:id', requireAuth, requireRole(['ADMIN']), SettingsController.deleteContact);

// Admin only — Slider images
router.post('/slider', requireAuth, requireRole(['ADMIN']), upload.single('image'), SettingsController.addSliderImage);
router.delete('/slider/:id', requireAuth, requireRole(['ADMIN']), SettingsController.deleteSliderImage);

export default router;
