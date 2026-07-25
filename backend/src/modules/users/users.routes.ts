import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { upload } from '../../middlewares/upload';
import { createUserSchema, updateUserSchema, changeStatusSchema } from './users.dto';

const router = Router();

router.get('/', requireAuth, requireRole(['ADMIN']), UsersController.getAllUsers);

router.get('/:id', requireAuth, UsersController.getUserById);

router.post('/', requireAuth, requireRole(['ADMIN']), validateRequest(createUserSchema), UsersController.createUser);

// Utiliser upload.fields pour gérer à la fois l'avatar et le CV dans le même appel
router.put('/:id', 
  requireAuth, 
  upload.fields([
    { name: 'avatar', maxCount: 1 }, 
    { name: 'cv', maxCount: 1 }
  ]), 
  validateRequest(updateUserSchema), 
  UsersController.updateUser
);

router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), validateRequest(changeStatusSchema), UsersController.changeUserStatus);

router.delete('/:id', requireAuth, requireRole(['ADMIN']), UsersController.deleteUser);

export default router;
