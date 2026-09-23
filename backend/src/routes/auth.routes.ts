import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/async-handler';
import { authenticate } from '../middleware/auth.middleware';
import { TeamMember } from '../models/team-member.model';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    tenantName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  })
});

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
}));

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.json({ success: true, data: result });
}));

router.get('/me', authenticate, asyncHandler(async (req: any, res) => {
  const user = await TeamMember.findById(req.user.userId).select('-passwordHash');
  res.json({ success: true, data: user });
}));

export const authRoutes = router;
