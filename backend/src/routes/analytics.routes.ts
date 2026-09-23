import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { analyticsService } from '../services/analytics.service';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
router.use(authenticate);
router.use(authorize('tenant_admin', 'manager'));

router.get('/dashboard', asyncHandler(async (req: any, res) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  
  const data = await analyticsService.getDashboard(req.user.tenantId, { start, end });
  res.json({ success: true, data });
}));

router.get('/sla-trend', asyncHandler(async (req: any, res) => {
  const data = await analyticsService.getSLABreachTrend(req.user.tenantId, 30);
  res.json({ success: true, data });
}));

router.get('/response-times', asyncHandler(async (req: any, res) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const data = await analyticsService.getFirstResponseTimes(req.user.tenantId, { start, end });
  res.json({ success: true, data });
}));

export const analyticsRoutes = router;
