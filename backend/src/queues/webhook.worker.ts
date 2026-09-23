import { Worker, Job } from 'bullmq';
import { queueClient } from '../config/redis';
import { webhookService } from '../services/webhook.service';
import { contactService } from '../services/contact.service';
import { ticketService } from '../services/ticket.service';
import { messageService } from '../services/message.service';
import { Ticket } from '../models/ticket.model';
import { logger } from '../config/logger';
import { socketService } from '../websocket/socket.service';

export const webhookWorker = new Worker('webhook-ingestion', async (job: Job) => {
  const { tenantId, payload } = job.data;
  try {
    const normalized = webhookService.normalizeWhatsAppMessage(payload) || webhookService.normalizeEmailMessage(payload);
    if (!normalized) return;

    if (await webhookService.isDuplicate(tenantId, normalized.externalId)) {
      logger.info(`Duplicate message ${normalized.externalId} ignored`);
      return;
    }

    const contact = await contactService.findOrCreate(tenantId, normalized.channel, normalized.contactPhone || normalized.contactEmail, {
      firstName: normalized.contactName
    });

    let ticket = await Ticket.findOne({
      tenantId,
      contactId: contact._id,
      status: { $in: ['new', 'open', 'pending', 'waiting_on_customer'] }
    });

    if (!ticket) {
      ticket = await ticketService.create(tenantId, {
        contactId: contact._id,
        channel: normalized.channel,
        subject: `New ${normalized.channel} conversation with ${normalized.contactName}`,
        status: 'new'
      });
      // Ticket assign and SLA is handled in ticketService.create
    }

    const messageData = {
      ticketId: ticket._id,
      contactId: contact._id,
      direction: 'inbound',
      type: normalized.message.type,
      channel: normalized.channel,
      content: normalized.message.content,
      sender: { type: 'contact', id: contact._id.toString(), name: contact.firstName },
      externalId: normalized.externalId,
    };

    const message = await messageService.create(tenantId, messageData);
    
    // Notify via socket
    if (ticket.assignedTo) {
      socketService.emitToUser(tenantId, ticket.assignedTo.toString(), 'MESSAGE_NEW', message);
    }
    socketService.emitToTicket(tenantId, ticket._id.toString(), 'MESSAGE_NEW', message);

  } catch (error) {
    logger.error(`Webhook processing failed: ${error}`);
    throw error;
  }
}, { 
  connection: queueClient,
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 }
});
