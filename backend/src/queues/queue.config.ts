import { Queue } from 'bullmq';
import { queueClient } from '../config/redis';

export const webhookQueue = new Queue('webhook-ingestion', { connection: queueClient });
export const slaQueue = new Queue('sla-watchdog', { connection: queueClient });
export const notificationQueue = new Queue('notification', { connection: queueClient });
