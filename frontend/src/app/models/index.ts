export interface User { id: string; name: string; email: string; avatar?: string; role: string; }
export interface ITicket { id: string; contactId: string; contactName: string; contactAvatar?: string; channel: 'whatsapp' | 'email' | 'web'; subject: string; status: 'open' | 'resolved' | 'escalated' | 'closed'; priority: 'low' | 'medium' | 'high' | 'urgent'; assigneeId?: string; assigneeName?: string; lastMessagePreview: string; unreadCount: number; createdAt: string; updatedAt: string; firstResponseDue: string; slaStatus: 'ok' | 'warning' | 'breached'; }
export interface IMessage { id: string; ticketId: string; senderId: string; senderType: 'agent' | 'contact' | 'system'; content: string; createdAt: string; deliveryStatus: 'sent' | 'delivered' | 'read'; }
export interface Contact { id: string; name: string; phone: string; email: string; avatar?: string; leadStatus: 'new' | 'contacted' | 'qualified' | 'customer'; totalTickets: number; lastContacted: string; }
export interface IPresencePayload { userId: string; status: 'online' | 'busy' | 'away' | 'offline'; lastActive: string; }
export interface ITypingPayload { ticketId: string; userId: string; isTyping: boolean; }
export interface ISLAAlertPayload { ticketId: string; slaStatus: 'warning' | 'breached'; remainingSeconds: number; }
