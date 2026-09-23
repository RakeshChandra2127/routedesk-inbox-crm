import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  tenantId: mongoose.Types.ObjectId;
  phone?: string;
  email?: string;
  webChatId?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  company?: string;
  avatarUrl?: string;
  tags: string[];
  channelIdentifiers: {
    channel: 'whatsapp' | 'email' | 'web_chat';
    identifier: string;
    verified: boolean;
  }[];
  leadStatus: 'new' | 'contacted' | 'qualified' | 'lost' | 'customer';
  leadScore: number;
  notes?: string;
  customFields?: Record<string, any>;
  totalTickets: number;
  lastContactedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    phone: { type: String },
    email: { type: String },
    webChatId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    displayName: { type: String },
    company: { type: String },
    avatarUrl: { type: String },
    tags: [{ type: String }],
    channelIdentifiers: [
      {
        channel: { type: String, enum: ['whatsapp', 'email', 'web_chat'], required: true },
        identifier: { type: String, required: true },
        verified: { type: Boolean, default: false },
      },
    ],
    leadStatus: { type: String, enum: ['new', 'contacted', 'qualified', 'lost', 'customer'], default: 'new' },
    leadScore: { type: Number, default: 0 },
    notes: { type: String },
    customFields: { type: Schema.Types.Mixed },
    totalTickets: { type: Number, default: 0 },
    lastContactedAt: { type: Date },
  },
  { timestamps: true }
);

contactSchema.index({ tenantId: 1, phone: 1 }, { sparse: true });
contactSchema.index({ tenantId: 1, email: 1 }, { sparse: true });
contactSchema.index({ tenantId: 1, webChatId: 1 }, { sparse: true });
contactSchema.index({ tenantId: 1, displayName: 'text' });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
