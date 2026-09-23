import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { ticketRoutes } from './ticket.routes';
import { messageRoutes } from './message.routes';
import { contactRoutes } from './contact.routes';
import { teamRoutes } from './team.routes';
import { webhookRoutes } from './webhook.routes';
import { analyticsRoutes } from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/messages', messageRoutes); // Often nested under tickets for getting, but here kept separate
router.use('/contacts', contactRoutes);
router.use('/team', teamRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
