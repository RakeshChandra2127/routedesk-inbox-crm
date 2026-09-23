import { Worker, Job } from 'bullmq';
import { queueClient } from '../config/redis';
import { socketService } from '../websocket/socket.service';
import { logger } from '../config/logger';

export const notificationWorker = new Worker('notification', async (job: Job) => {
  const { tenantId, userId, role, type, title, body, data } = job.data;
  try {
    if (userId) {
      socketService.emitToUser(tenantId, userId, 'NOTIFICATION', { type, title, body, data });
    } else if (role) {
      // In a real implementation, find all online users with this role and emit to them
      // Alternatively, use socket.io rooms for roles
    }
  } catch (error) {
    logger.error(`Notification failed: ${error}`);
  }
}, { connection: queueClient });
