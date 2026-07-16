import { Router } from 'express';
import { AnnouncementsController } from './announcements.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { createAnnouncementSchema, updateAnnouncementSchema } from './announcements.dto';

const router = Router();

router.post('/', requireAuth, requireRole(['ENCADRANT']), validateRequest(createAnnouncementSchema), AnnouncementsController.createAnnouncement);

router.put('/:id', requireAuth, requireRole(['ENCADRANT']), validateRequest(updateAnnouncementSchema), AnnouncementsController.updateAnnouncement);

router.delete('/:id', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), AnnouncementsController.deleteAnnouncement);

export default router;
