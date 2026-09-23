import { presenceService } from './presence.service';
import { TeamMember } from '../models/team-member.model';
import { Ticket } from '../models/ticket.model';
import { Tenant } from '../models/tenant.model';
import { cacheClient } from '../config/redis';
import { logger } from '../config/logger';

export const routingService = {
  async assignTicket(tenantId: string, ticketId: string) {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.settings.autoAssign) return null;

    const strategy = tenant.settings.routingStrategy;
    if (strategy === 'manual') return null;

    const onlineAgentIds = await presenceService.getOnlineAgents(tenantId);
    if (onlineAgentIds.length === 0) return null;

    const agents = await TeamMember.find({
      _id: { $in: onlineAgentIds },
      role: { $in: ['agent', 'tenant_admin'] },
      $expr: { $lt: ['$workload.activeTickets', '$workload.maxTickets'] }
    });

    if (agents.length === 0) return null;

    let selectedAgent = null;

    if (strategy === 'least_loaded') {
      selectedAgent = agents.sort((a, b) => a.workload.activeTickets - b.workload.activeTickets)[0];
    } else if (strategy === 'round_robin') {
      const counter = await cacheClient.incr(`routing_counter:${tenantId}`);
      const index = counter % agents.length;
      selectedAgent = agents[index];
    }

    if (selectedAgent) {
      await Ticket.findByIdAndUpdate(ticketId, {
        assignedTo: selectedAgent._id,
        status: 'open'
      });

      await TeamMember.findByIdAndUpdate(selectedAgent._id, {
        $inc: { 'workload.activeTickets': 1 }
      });

      logger.info(`Ticket ${ticketId} assigned to agent ${selectedAgent._id}`);
      // Socket emission should be handled by the caller or a dedicated event bus
      return selectedAgent;
    }

    return null;
  },

  async unassignTicket(tenantId: string, ticketId: string) {
    const ticket = await Ticket.findById(ticketId);
    if (ticket && ticket.assignedTo) {
      await TeamMember.findByIdAndUpdate(ticket.assignedTo, {
        $inc: { 'workload.activeTickets': -1 }
      });
      await Ticket.findByIdAndUpdate(ticketId, {
        $unset: { assignedTo: 1 }
      });
    }
  },

  async rebalanceTickets(tenantId: string) {
    // Advanced: Find unassigned tickets and try to assign them
    const unassignedTickets = await Ticket.find({ tenantId, assignedTo: { $exists: false }, status: 'new' });
    for (const ticket of unassignedTickets) {
      await this.assignTicket(tenantId, ticket._id.toString());
    }
  }
};
