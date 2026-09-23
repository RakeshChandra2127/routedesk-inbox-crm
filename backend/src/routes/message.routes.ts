import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { messageService } from '../services/message.service';
import { asyncHandler } from '../utils/async-handler';
import { paginate } from '../utils/helpers';

const router = Router();
router.use(authenticate);

router.get('/:ticketId/messages', asyncHandler(async (req: any, res) => {
  const pagination = paginate(req.query.page as any, req.query.limit as any);
  const result = await messageService.findByTicket(req.user.tenantId, req.params.ticketId, pagination);
  res.json({ success: true, data: result });
}));

router.post('/:ticketId/messages', asyncHandler(async (req: any, res) => {
  const data = {
    ...req.body,
    ticketId: req.params.ticketId,
    direction: 'outbound',
    sender: { type: 'agent', id: req.user.userId }
  };
  const message = await messageService.create(req.user.tenantId, data);
  // Emit event via socket or queue
  res.status(201).json({ success: true, data: message });
}));

router.post('/:ticketId/messages/read', asyncHandler(async (req: any, res) => {
  await messageService.markAsRead(req.user.tenantId, req.params.ticketId, req.user.userId);
  res.json({ success: true });
}));

export const messageRoutes = router;
