export * from './queue.config';
import { webhookWorker } from './webhook.worker';
import { slaWorker } from './sla.worker';
import { notificationWorker } from './notification.worker';
import { logger } from '../config/logger';

export const startWorkers = () => {
  webhookWorker.on('failed', (job, err) => logger.error(`Webhook job failed: ${err.message}`));
  slaWorker.on('failed', (job, err) => logger.error(`SLA job failed: ${err.message}`));
  notificationWorker.on('failed', (job, err) => logger.error(`Notification job failed: ${err.message}`));
  
  logger.info('Queue workers started');
};

export const stopWorkers = async () => {
  await webhookWorker.close();
  await slaWorker.close();
  await notificationWorker.close();
};
