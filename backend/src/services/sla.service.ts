import { Queue } from 'bullmq';
import { queueClient } from '../config/redis';
import { Ticket } from '../models/ticket.model';
import { Tenant } from '../models/tenant.model';
import { logger } from '../config/logger';

const slaQueue = new Queue('sla-watchdog', { connection: queueClient });

export const slaService = {
  async createSLATimers(ticket: any) {
    const tenant = await Tenant.findById(ticket.tenantId);
    if (!tenant) return;

    const firstResponseDue = new Date(ticket.createdAt.getTime() + tenant.slaConfig.firstResponseMinutes * 60000);
    const resolutionDue = new Date(ticket.createdAt.getTime() + tenant.slaConfig.resolutionHours * 3600000);

    ticket.sla.firstResponseDue = firstResponseDue;
    ticket.sla.resolutionDue = resolutionDue;
    await ticket.save();

    await slaQueue.add('check-first-response', { ticketId: ticket._id.toString() }, {
      jobId: `sla-fr-${ticket._id}`,
      delay: firstResponseDue.getTime() - Date.now()
    });

    await slaQueue.add('check-resolution', { ticketId: ticket._id.toString() }, {
      jobId: `sla-res-${ticket._id}`,
      delay: resolutionDue.getTime() - Date.now()
    });
  },

  async checkFirstResponseSLA(ticketId: string) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.firstResponseAt || ticket.sla.firstResponseBreached) return;

    ticket.sla.firstResponseBreached = true;
    ticket.sla.firstResponseBreachedAt = new Date();
    await ticket.save();
    
    logger.warn(`SLA First Response breached for ticket ${ticketId}`);
    // Emit event, notify
  },

  async checkResolutionSLA(ticketId: string) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.resolvedAt || ticket.sla.resolutionBreached) return;

    ticket.sla.resolutionBreached = true;
    ticket.sla.resolutionBreachedAt = new Date();
    await ticket.save();

    logger.warn(`SLA Resolution breached for ticket ${ticketId}`);
  },

  async pauseSLA(ticketId: string) {
    await Ticket.findByIdAndUpdate(ticketId, {
      'sla.pausedAt': new Date()
    });
  },

  async resumeSLA(ticketId: string) {
    const ticket = await Ticket.findById(ticketId);
    if (ticket && ticket.sla.pausedAt) {
      const pausedDuration = Date.now() - ticket.sla.pausedAt.getTime();
      
      const updateData: any = {
        $inc: { 'sla.totalPausedMs': pausedDuration },
        $unset: { 'sla.pausedAt': 1 }
      };

      if (ticket.sla.firstResponseDue) {
        updateData['sla.firstResponseDue'] = new Date(ticket.sla.firstResponseDue.getTime() + pausedDuration);
      }
      if (ticket.sla.resolutionDue) {
        updateData['sla.resolutionDue'] = new Date(ticket.sla.resolutionDue.getTime() + pausedDuration);
      }

      await Ticket.findByIdAndUpdate(ticketId, updateData);
    }
  },

  async cancelSLATimers(ticketId: string) {
    await slaQueue.remove(`sla-fr-${ticketId}`);
    await slaQueue.remove(`sla-res-${ticketId}`);
  },

  getSLAStatus(ticket: any) {
    // Calculate remaining time, etc.
    return {
      firstResponse: ticket.sla.firstResponseDue,
      resolution: ticket.sla.resolutionDue
    };
  }
};
