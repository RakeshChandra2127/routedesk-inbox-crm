import { Router } from 'express';
import { config } from '../config';
import { Queue } from 'bullmq';
import { queueClient } from '../config/redis';

const router = Router();
const webhookQueue = new Queue('webhook-ingestion', { connection: queueClient });

router.get('/whatsapp', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === config.whatsapp.verifyToken
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

router.post('/whatsapp', async (req, res) => {
  // We should extract tenantId from the URL or headers in a real SaaS
  const tenantId = req.query.tenantId as string; 
  if (tenantId) {
    await webhookQueue.add('process-whatsapp', { tenantId, payload: req.body });
  }
  res.sendStatus(200);
});

router.post('/email/inbound', async (req, res) => {
  const tenantId = req.query.tenantId as string;
  if (tenantId) {
    await webhookQueue.add('process-email', { tenantId, payload: req.body });
  }
  res.sendStatus(200);
});

router.post('/whatsapp/status', async (req, res) => {
  const tenantId = req.query.tenantId as string;
  if (tenantId) {
    await webhookQueue.add('process-status', { tenantId, payload: req.body });
  }
  res.sendStatus(200);
});

export const webhookRoutes = router;
