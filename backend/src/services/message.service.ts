import { Message } from '../models/message.model';
import { Ticket } from '../models/ticket.model';
import { AppError } from '../utils/app-error';

export const messageService = {
  async create(tenantId: string, data: any) {
    if (data.externalId) {
      const existing = await Message.findOne({ tenantId, externalId: data.externalId });
      if (existing) return existing;
    }

    const message = await Message.create({ ...data, tenantId });

    const ticket = await Ticket.findOne({ _id: message.ticketId, tenantId });
    if (ticket) {
      const updateData: any = {
        lastMessageAt: new Date(),
        $inc: { messageCount: 1 }
      };

      if (data.direction === 'outbound' && data.sender.type === 'agent' && !ticket.firstResponseAt) {
        updateData.firstResponseAt = new Date();
      }
      
      // If customer replies, change status to open if it was waiting
      if (data.direction === 'inbound' && ticket.status === 'waiting_on_customer') {
        updateData.status = 'open';
        // sla resume is typically handled via events, but we can do a simplified version here
      }

      await Ticket.findByIdAndUpdate(ticket._id, updateData);
    }

    return message;
  },

  async findByTicket(tenantId: string, ticketId: string, pagination: any) {
    const messages = await Message.find({ tenantId, ticketId })
      .sort({ createdAt: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await Message.countDocuments({ tenantId, ticketId });
    return { data: messages, total, ...pagination };
  },

  async updateDeliveryStatus(tenantId: string, messageId: string, status: string, timestamps: any) {
    const update = { deliveryStatus: status, ...timestamps };
    return Message.findOneAndUpdate({ _id: messageId, tenantId }, update, { new: true });
  },

  async markAsRead(tenantId: string, ticketId: string, userId: string) {
    // For agents reading inbound messages
    await Message.updateMany(
      { tenantId, ticketId, direction: 'inbound', deliveryStatus: { $ne: 'read' } },
      { deliveryStatus: 'read', 'deliveryTimestamps.readAt': new Date() }
    );
  }
};
