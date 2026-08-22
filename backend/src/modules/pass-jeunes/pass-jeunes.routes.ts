import { Router } from 'express';
import { PassJeunesController } from './pass-jeunes.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';

const router = Router();

// Public
router.get('/', PassJeunesController.getAllServices);
router.get('/:id', PassJeunesController.getServiceById);

// Admin only
router.post('/', requireAuth, requireRole(['ADMIN']), upload.array('images', 10), PassJeunesController.createService);
router.put('/:id', requireAuth, requireRole(['ADMIN']), PassJeunesController.updateService);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), PassJeunesController.deleteService);

export default router;
