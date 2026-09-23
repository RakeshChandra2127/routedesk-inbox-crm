import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  tenantId: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  contactId: mongoose.Types.ObjectId;
  direction: 'inbound' | 'outbound';
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'location' | 'template' | 'system' | 'note';
  channel: 'whatsapp' | 'email' | 'web_chat';
  content: {
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
  };
  sender: {
    type: 'contact' | 'agent' | 'system';
    id?: string;
    name?: string;
    avatar?: string;
  };
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  deliveryTimestamps: {
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    failedAt?: Date;
    failureReason?: string;
  };
  externalId?: string;
  replyToId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
    direction: { type: String, enum: ['inbound', 'outbound'], required: true },
    type: { type: String, enum: ['text', 'image', 'document', 'audio', 'video', 'location', 'template', 'system', 'note'], required: true },
    channel: { type: String, enum: ['whatsapp', 'email', 'web_chat'], required: true },
    content: {
      text: { type: String },
      html: { type: String },
      subject: { type: String },
      mediaUrl: { type: String },
      mediaType: { type: String },
      fileName: { type: String },
      fileSize: { type: Number },
      latitude: { type: Number },
      longitude: { type: Number },
      caption: { type: String },
    },
    sender: {
      type: { type: String, enum: ['contact', 'agent', 'system'], required: true },
      id: { type: String },
      name: { type: String },
      avatar: { type: String },
    },
    deliveryStatus: { type: String, enum: ['pending', 'sent', 'delivered', 'read', 'failed'], default: 'pending' },
    deliveryTimestamps: {
      sentAt: { type: Date },
      deliveredAt: { type: Date },
      readAt: { type: Date },
      failedAt: { type: Date },
      failureReason: { type: String },
    },
    externalId: { type: String },
    replyToId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

messageSchema.index({ ticketId: 1, createdAt: 1 });
messageSchema.index({ tenantId: 1, externalId: 1 }, { sparse: true, unique: true });
messageSchema.index({ tenantId: 1, contactId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
