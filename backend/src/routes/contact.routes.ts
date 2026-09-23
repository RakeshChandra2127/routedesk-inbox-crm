import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { contactService } from '../services/contact.service';
import { asyncHandler } from '../utils/async-handler';
import { paginate } from '../utils/helpers';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: any, res) => {
  if (req.query.q) {
    const contacts = await contactService.search(req.user.tenantId, req.query.q as string);
    return res.json({ success: true, data: { data: contacts, total: contacts.length } });
  }

  const pagination = paginate(req.query.page as any, req.query.limit as any);
  const result = await contactService.findAll(req.user.tenantId, {}, pagination);
  res.json({ success: true, data: result });
}));

router.get('/:id', asyncHandler(async (req: any, res) => {
  const contact = await contactService.findById(req.user.tenantId, req.params.id);
  res.json({ success: true, data: contact });
}));

router.patch('/:id', asyncHandler(async (req: any, res) => {
  const contact = await contactService.update(req.user.tenantId, req.params.id, req.body);
  res.json({ success: true, data: contact });
}));

router.post('/:id/convert-to-lead', asyncHandler(async (req: any, res) => {
  const contact = await contactService.convertToLead(req.user.tenantId, req.params.id, req.body.status || 'qualified');
  res.json({ success: true, data: contact });
}));

export const contactRoutes = router;
