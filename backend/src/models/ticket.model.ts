import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  tenantId: mongoose.Types.ObjectId;
  ticketNumber: number;
  contactId: mongoose.Types.ObjectId;
  channel: 'whatsapp' | 'email' | 'web_chat';
  status: 'new' | 'open' | 'pending' | 'waiting_on_customer' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  subject: string;
  assignedTo?: mongoose.Types.ObjectId;
  tags: string[];
  sla: {
    firstResponseDue?: Date;
    resolutionDue?: Date;
    firstResponseBreached: boolean;
    resolutionBreached: boolean;
    firstResponseBreachedAt?: Date;
    resolutionBreachedAt?: Date;
    pausedAt?: Date;
    totalPausedMs: number;
  };
  metadata?: Record<string, any>;
  messageCount: number;
  lastMessageAt?: Date;
  firstResponseAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    ticketNumber: { type: Number, required: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
    channel: { type: String, enum: ['whatsapp', 'email', 'web_chat'], required: true },
    status: { type: String, enum: ['new', 'open', 'pending', 'waiting_on_customer', 'escalated', 'resolved', 'closed'], default: 'new' },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    subject: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'TeamMember' },
    tags: [{ type: String }],
    sla: {
      firstResponseDue: { type: Date },
      resolutionDue: { type: Date },
      firstResponseBreached: { type: Boolean, default: false },
      resolutionBreached: { type: Boolean, default: false },
      firstResponseBreachedAt: { type: Date },
      resolutionBreachedAt: { type: Date },
      pausedAt: { type: Date },
      totalPausedMs: { type: Number, default: 0 },
    },
    metadata: { type: Schema.Types.Mixed },
    messageCount: { type: Number, default: 0 },
    lastMessageAt: { type: Date },
    firstResponseAt: { type: Date },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

ticketSchema.index({ tenantId: 1, status: 1, lastMessageAt: -1 });
ticketSchema.index({ tenantId: 1, assignedTo: 1, status: 1 });
ticketSchema.index({ tenantId: 1, contactId: 1 });
ticketSchema.index({ tenantId: 1, 'sla.firstResponseDue': 1, 'sla.firstResponseBreached': 1 });
ticketSchema.index({ tenantId: 1, createdAt: -1 });
ticketSchema.index({ tenantId: 1, ticketNumber: 1 }, { unique: true });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
