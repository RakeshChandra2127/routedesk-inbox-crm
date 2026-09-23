import { Ticket } from '../models/ticket.model';
import { Counter } from '../models/counter.model';
import { routingService } from './routing.service';
import { slaService } from './sla.service';
import { AppError } from '../utils/app-error';
import { TeamMember } from '../models/team-member.model';

export const ticketService = {
  async create(tenantId: string, data: any) {
    const ticketNumber = await Counter.getNextValue(tenantId, 'ticketNumber');
    const ticket = await Ticket.create({
      ...data,
      tenantId,
      ticketNumber,
    });

    await routingService.assignTicket(tenantId, ticket._id.toString());
    await slaService.createSLATimers(ticket);

    return ticket;
  },

  async findAll(tenantId: string, filters: any, pagination: any) {
    const query = { tenantId, ...filters };
    const tickets = await Ticket.find(query)
      .sort({ lastMessageAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('contactId')
      .populate('assignedTo');
    
    const total = await Ticket.countDocuments(query);
    return { data: tickets, total, ...pagination };
  },

  async findById(tenantId: string, id: string) {
    const ticket = await Ticket.findOne({ _id: id, tenantId }).populate('contactId').populate('assignedTo');
    if (!ticket) throw new AppError(404, 'Ticket not found', 'NOT_FOUND');
    return ticket;
  },

  async update(tenantId: string, id: string, data: any) {
    const ticket = await Ticket.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
    if (!ticket) throw new AppError(404, 'Ticket not found', 'NOT_FOUND');
    return ticket;
  },

  async assign(tenantId: string, ticketId: string, agentId: string) {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, tenantId },
      { assignedTo: agentId, status: 'open' },
      { new: true }
    );
    if (!ticket) throw new AppError(404, 'Ticket not found');
    await TeamMember.findByIdAndUpdate(agentId, { $inc: { 'workload.activeTickets': 1 } });
    return ticket;
  },

  async updateStatus(tenantId: string, ticketId: string, status: string) {
    const ticket = await Ticket.findOne({ _id: ticketId, tenantId });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    if (status === 'resolved' || status === 'closed') {
      ticket.status = status as any;
      if (status === 'resolved') ticket.resolvedAt = new Date();
      if (status === 'closed') ticket.closedAt = new Date();
      await ticket.save();

      await slaService.cancelSLATimers(ticketId);
      if (ticket.assignedTo) {
        await TeamMember.findByIdAndUpdate(ticket.assignedTo, {
          $inc: { 'workload.activeTickets': -1, 'workload.ticketsResolvedToday': 1 }
        });
      }
    } else if (status === 'waiting_on_customer') {
      ticket.status = status;
      await ticket.save();
      await slaService.pauseSLA(ticketId);
    } else if (ticket.status === 'waiting_on_customer' && status === 'open') {
      ticket.status = status;
      await ticket.save();
      await slaService.resumeSLA(ticketId);
    } else {
      ticket.status = status as any;
      await ticket.save();
    }
    return ticket;
  },

  async escalate(tenantId: string, ticketId: string) {
    return this.updateStatus(tenantId, ticketId, 'escalated');
  },

  async getMyTickets(tenantId: string, agentId: string) {
    return Ticket.find({ tenantId, assignedTo: agentId, status: { $nin: ['resolved', 'closed'] } })
      .sort({ 'sla.firstResponseDue': 1, 'sla.resolutionDue': 1 });
  },

  async getUnassigned(tenantId: string) {
    return Ticket.find({ tenantId, assignedTo: { $exists: false }, status: 'new' })
      .sort({ createdAt: 1 });
  }
};
