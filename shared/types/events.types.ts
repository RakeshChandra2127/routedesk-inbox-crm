export enum SocketEvent {
  // Connection
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  AUTHENTICATE = 'authenticate',
  AUTHENTICATED = 'authenticated',
  AUTH_ERROR = 'auth_error',
  // Presence
  PRESENCE_UPDATE = 'presence:update',
  PRESENCE_BULK = 'presence:bulk',
  // Tickets
  TICKET_CREATED = 'ticket:created',
  TICKET_ASSIGNED = 'ticket:assigned',
  TICKET_UPDATED = 'ticket:updated',
  TICKET_ESCALATED = 'ticket:escalated',
  TICKET_RESOLVED = 'ticket:resolved',
  // Messages
  MESSAGE_NEW = 'message:new',
  MESSAGE_DELIVERY_UPDATE = 'message:delivery_update',
  // Typing
  TYPING_START = 'typing:start',
  TYPING_STOP = 'typing:stop',
  // SLA
  SLA_WARNING = 'sla:warning',
  SLA_BREACHED = 'sla:breached',
  // Notifications
  NOTIFICATION = 'notification',
  // Errors
  ERROR = 'error',
}

export interface IPresencePayload {
  userId: string;
  tenantId: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeenAt: Date;
}

export interface ITypingPayload {
  ticketId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ISLAAlertPayload {
  ticketId: string;
  ticketNumber: number;
  contactName: string;
  type: 'warning' | 'breach';
  slaType: 'first_response' | 'resolution';
  dueAt: Date;
  assignedTo?: string;
}

export interface INotification {
  id: string;
  tenantId: string;
  userId?: string;
  type: 'ticket_assigned' | 'sla_warning' | 'sla_breach' | 'new_message' | 'escalation';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}
