export enum MessageDirection { INBOUND = 'inbound', OUTBOUND = 'outbound' }
export enum MessageType { TEXT = 'text', IMAGE = 'image', DOCUMENT = 'document', AUDIO = 'audio', VIDEO = 'video', LOCATION = 'location', TEMPLATE = 'template', SYSTEM = 'system', NOTE = 'note' }
export enum DeliveryStatus { PENDING = 'pending', SENT = 'sent', DELIVERED = 'delivered', READ = 'read', FAILED = 'failed' }

export interface IMessage {
  _id: string;
  tenantId: string;
  ticketId: string;
  contactId: string;
  direction: MessageDirection;
  type: MessageType;
  channel: 'whatsapp' | 'email' | 'web_chat';
  content: IMessageContent;
  sender: IMessageSender;
  deliveryStatus: DeliveryStatus;
  deliveryTimestamps: IDeliveryTimestamps;
  externalId?: string;
  replyToId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface IMessageContent {
  text?: string;
  html?: string;
  subject?: string;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
  latitude?: number;
  longitude?: number;
  caption?: string;
}

export interface IMessageSender {
  type: 'contact' | 'agent' | 'system';
  id: string;
  name: string;
  avatar?: string;
}

export interface IDeliveryTimestamps {
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}
