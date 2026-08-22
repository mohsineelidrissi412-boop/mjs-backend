import { Router } from 'express';
import { AnnouncementsController } from './announcements.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { createAnnouncementSchema } from './announcements.dto';

const router = Router();

// Public
router.get('/', AnnouncementsController.getAllAnnouncements);

// Admin or Encadrant
router.post('/', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), validateRequest(createAnnouncementSchema), AnnouncementsController.createAnnouncement);
router.put('/:id', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), validateRequest(createAnnouncementSchema), AnnouncementsController.updateAnnouncement);
router.delete('/:id', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), AnnouncementsController.deleteAnnouncement);

export default router;
