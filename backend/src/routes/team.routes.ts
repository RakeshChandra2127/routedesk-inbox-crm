import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { TeamMember } from '../models/team-member.model';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: any, res) => {
  const team = await TeamMember.find({ tenantId: req.user.tenantId }).select('-passwordHash');
  res.json({ success: true, data: team });
}));

router.get('/:id', asyncHandler(async (req: any, res) => {
  const member = await TeamMember.findOne({ _id: req.params.id, tenantId: req.user.tenantId }).select('-passwordHash');
  res.json({ success: true, data: member });
}));

router.post('/', authorize('tenant_admin'), asyncHandler(async (req: any, res) => {
  // Mock invite
  res.status(201).json({ success: true, data: { message: 'Invited' } });
}));

router.patch('/:id', authorize('tenant_admin'), asyncHandler(async (req: any, res) => {
  const member = await TeamMember.findOneAndUpdate({ _id: req.params.id, tenantId: req.user.tenantId }, req.body, { new: true }).select('-passwordHash');
  res.json({ success: true, data: member });
}));

router.patch('/:id/presence', authorize('tenant_admin', 'manager', 'agent'), asyncHandler(async (req: any, res) => {
  // Handled mostly by socket, but can have rest fallback
  res.json({ success: true });
}));

export const teamRoutes = router;
