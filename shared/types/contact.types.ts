export interface IContact {
  _id: string;
  tenantId: string;
  phone?: string;
  email?: string;
  webChatId?: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  company?: string;
  avatarUrl?: string;
  tags: string[];
  channelIdentifiers: IChannelIdentifier[];
  leadStatus?: LeadStatus;
  leadScore?: number;
  notes: string;
  customFields: Record<string, unknown>;
  totalTickets: number;
  lastContactedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChannelIdentifier {
  channel: 'whatsapp' | 'email' | 'web_chat';
  identifier: string; // phone number, email, or session ID
  verified: boolean;
}

export enum LeadStatus { NEW = 'new', CONTACTED = 'contacted', QUALIFIED = 'qualified', PROPOSAL = 'proposal', WON = 'won', LOST = 'lost' }
