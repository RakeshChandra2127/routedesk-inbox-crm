export enum TicketStatus { NEW = 'new', OPEN = 'open', PENDING = 'pending', WAITING_ON_CUSTOMER = 'waiting_on_customer', ESCALATED = 'escalated', RESOLVED = 'resolved', CLOSED = 'closed' }
export enum TicketPriority { LOW = 'low', MEDIUM = 'medium', HIGH = 'high', URGENT = 'urgent' }
export enum TicketChannel { WHATSAPP = 'whatsapp', EMAIL = 'email', WEB_CHAT = 'web_chat' }

export interface ITicket {
  _id: string;
  tenantId: string;
  ticketNumber: number;
  contactId: string;
  channel: TicketChannel;
  status: TicketStatus;
  priority: TicketPriority;
  subject?: string;
  assignedTo?: string;
  tags: string[];
  sla: ISLAState;
  metadata: ITicketMetadata;
  messageCount: number;
  lastMessageAt: Date;
  firstResponseAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISLAState {
  firstResponseDue: Date;
  resolutionDue: Date;
  firstResponseBreached: boolean;
  resolutionBreached: boolean;
  firstResponseBreachedAt?: Date;
  resolutionBreachedAt?: Date;
  pausedAt?: Date;
  totalPausedMs: number;
}

export interface ITicketMetadata {
  source: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  externalId?: string;
}
