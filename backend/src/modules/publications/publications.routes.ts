import { Router } from 'express';
import { PublicationsController } from './publications.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { upload } from '../../middlewares/upload';
import { createPublicationSchema, likePublicationSchema, commentPublicationSchema } from './publications.dto';

const router = Router();

router.get('/', PublicationsController.getAllPublications);

router.post('/', requireAuth, requireRole(['ADMIN']), upload.array('images', 5), validateRequest(createPublicationSchema), PublicationsController.createPublication);

router.put('/:id', requireAuth, requireRole(['ADMIN']), validateRequest(createPublicationSchema), PublicationsController.updatePublication);

router.delete('/:id', requireAuth, requireRole(['ADMIN']), PublicationsController.deletePublication);

router.post('/:id/like', requireAuth, validateRequest(likePublicationSchema), PublicationsController.likePublication);

router.post('/:id/comments', requireAuth, validateRequest(commentPublicationSchema), PublicationsController.commentPublication);

export default router;
