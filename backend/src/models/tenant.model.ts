import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  settings: {
    maxTeamMembers: number;
    maxTicketsPerAgent: number;
    businessHours: any; // Simplified for now
    autoAssign: boolean;
    routingStrategy: 'least_loaded' | 'round_robin' | 'manual';
  };
  slaConfig: {
    firstResponseMinutes: number;
    resolutionHours: number;
    escalationEnabled: boolean;
    breachNotifyRoles: string[];
  };
  channelConfigs: {
    whatsapp?: { enabled: boolean; phoneNumberId?: string };
    email?: { enabled: boolean; inboundAddress?: string };
    webChat?: { enabled: boolean; widgetId?: string };
  };
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    settings: {
      maxTeamMembers: { type: Number, default: 5 },
      maxTicketsPerAgent: { type: Number, default: 5 },
      businessHours: { type: Schema.Types.Mixed },
      autoAssign: { type: Boolean, default: true },
      routingStrategy: { type: String, enum: ['least_loaded', 'round_robin', 'manual'], default: 'least_loaded' },
    },
    slaConfig: {
      firstResponseMinutes: { type: Number, default: 15 },
      resolutionHours: { type: Number, default: 24 },
      escalationEnabled: { type: Boolean, default: true },
      breachNotifyRoles: [{ type: String }],
    },
    channelConfigs: {
      whatsapp: { enabled: { type: Boolean, default: false }, phoneNumberId: String },
      email: { enabled: { type: Boolean, default: false }, inboundAddress: String },
      webChat: { enabled: { type: Boolean, default: false }, widgetId: String },
    },
  },
  { timestamps: true }
);

tenantSchema.index({ slug: 1 }, { unique: true });

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
