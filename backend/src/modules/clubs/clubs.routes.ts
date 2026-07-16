import { Router } from 'express';
import { ClubsController } from './clubs.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { upload } from '../../middlewares/upload';
import { createClubSchema, assignEncadrantSchema, handleJoinSchema } from './clubs.dto';

const router = Router();

router.get('/', ClubsController.getAllClubs);

router.get('/:id', requireAuth, ClubsController.getClubById);

router.post('/', requireAuth, requireRole(['ADMIN']), upload.single('logo'), validateRequest(createClubSchema), ClubsController.createClub);

router.put('/:id', requireAuth, requireRole(['ADMIN']), upload.single('logo'), validateRequest(createClubSchema), ClubsController.updateClub);

router.delete('/:id', requireAuth, requireRole(['ADMIN']), ClubsController.deleteClub);

router.post('/:id/assign-encadrant', requireAuth, requireRole(['ADMIN']), validateRequest(assignEncadrantSchema), ClubsController.assignEncadrant);

router.post('/:id/join', requireAuth, requireRole(['MEMBER']), ClubsController.joinClub);

router.patch('/:id/join-requests/:userId', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), validateRequest(handleJoinSchema), ClubsController.handleJoinRequest);

export default router;
