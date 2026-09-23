import { Worker, Job } from 'bullmq';
import { queueClient } from '../config/redis';
import { slaService } from '../services/sla.service';
import { logger } from '../config/logger';

export const slaWorker = new Worker('sla-watchdog', async (job: Job) => {
  const { ticketId } = job.data;
  try {
    if (job.name === 'check-first-response') {
      await slaService.checkFirstResponseSLA(ticketId);
    } else if (job.name === 'check-resolution') {
      await slaService.checkResolutionSLA(ticketId);
    }
  } catch (error) {
    logger.error(`SLA check failed for ticket ${ticketId}: ${error}`);
    throw error;
  }
}, { connection: queueClient });
