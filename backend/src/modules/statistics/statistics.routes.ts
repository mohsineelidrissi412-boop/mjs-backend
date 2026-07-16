import { Router } from 'express';
import { StatisticsController } from './statistics.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';

const router = Router();

router.get('/admin', requireAuth, requireRole(['ADMIN']), StatisticsController.getAdminStats);
router.get('/encadrant', requireAuth, requireRole(['ENCADRANT']), StatisticsController.getEncadrantStats);

export default router;
