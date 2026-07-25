import { Router } from 'express';
import { EventsController } from './events.controller';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { createEventSchema, updateEventSchema } from './events.dto';

const router = Router();

router.get('/', EventsController.getAllEvents);

router.post('/', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), validateRequest(createEventSchema), EventsController.createEvent);

router.put('/:id', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), validateRequest(updateEventSchema), EventsController.updateEvent);

router.delete('/:id', requireAuth, requireRole(['ADMIN', 'ENCADRANT']), EventsController.deleteEvent);

export default router;
