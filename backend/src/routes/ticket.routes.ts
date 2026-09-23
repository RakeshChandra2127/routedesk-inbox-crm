import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { ticketService } from '../services/ticket.service';
import { asyncHandler } from '../utils/async-handler';
import { paginate } from '../utils/helpers';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: any, res) => {
  const pagination = paginate(req.query.page as any, req.query.limit as any);
  const filters: any = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;
  if (req.query.channel) filters.channel = req.query.channel;
  
  const result = await ticketService.findAll(req.user.tenantId, filters, pagination);
  res.json({ success: true, data: result });
}));

router.get('/my', asyncHandler(async (req: any, res) => {
  const tickets = await ticketService.getMyTickets(req.user.tenantId, req.user.userId);
  res.json({ success: true, data: tickets });
}));

router.get('/unassigned', authorize('tenant_admin', 'manager'), asyncHandler(async (req: any, res) => {
  const tickets = await ticketService.getUnassigned(req.user.tenantId);
  res.json({ success: true, data: tickets });
}));

router.get('/:id', asyncHandler(async (req: any, res) => {
  const ticket = await ticketService.findById(req.user.tenantId, req.params.id);
  res.json({ success: true, data: ticket });
}));

router.post('/', asyncHandler(async (req: any, res) => {
  const ticket = await ticketService.create(req.user.tenantId, req.body);
  res.status(201).json({ success: true, data: ticket });
}));

router.patch('/:id', asyncHandler(async (req: any, res) => {
  const ticket = await ticketService.update(req.user.tenantId, req.params.id, req.body);
  res.json({ success: true, data: ticket });
}));

router.post('/:id/assign', asyncHandler(async (req: any, res) => {
  const ticket = await ticketService.assign(req.user.tenantId, req.params.id, req.body.agentId);
  res.json({ success: true, data: ticket });
}));

router.post('/:id/escalate', asyncHandler(async (req: any, res) => {
  const ticket = await ticketService.escalate(req.user.tenantId, req.params.id);
  res.json({ success: true, data: ticket });
}));

router.post('/:id/resolve', asyncHandler(async (req: any, res) => {
  const ticket = await ticketService.updateStatus(req.user.tenantId, req.params.id, 'resolved');
  res.json({ success: true, data: ticket });
}));

router.post('/:id/close', asyncHandler(async (req: any, res) => {
  const ticket = await ticketService.updateStatus(req.user.tenantId, req.params.id, 'closed');
  res.json({ success: true, data: ticket });
}));

export const ticketRoutes = router;
