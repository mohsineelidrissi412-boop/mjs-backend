import { Router } from 'express';
import { NewsController } from './news.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { upload } from '../../middlewares/upload';
import { createNewsSchema, commentSchema } from './news.dto';

const router = Router();

// Public routes
router.get('/', NewsController.getAllNews);
router.get('/:id', NewsController.getNewsById);

// Admin-only CRUD
router.post('/', requireAuth, requireRole(['ADMIN']), upload.array('images', 10), validateRequest(createNewsSchema), NewsController.createNews);
router.put('/:id', requireAuth, requireRole(['ADMIN']), validateRequest(createNewsSchema), NewsController.updateNews);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), NewsController.deleteNews);

// Authenticated user actions
router.post('/:id/like', requireAuth, NewsController.toggleLike);
router.post('/:id/share', NewsController.shareNews);
router.post('/:id/comments', requireAuth, validateRequest(commentSchema), NewsController.addComment);
router.delete('/:id/comments/:commentId', requireAuth, NewsController.deleteComment);

export default router;
