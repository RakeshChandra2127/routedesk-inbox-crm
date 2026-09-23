export enum TenantPlan { FREE = 'free', STARTER = 'starter', PROFESSIONAL = 'professional', ENTERPRISE = 'enterprise' }
export enum TenantStatus { ACTIVE = 'active', SUSPENDED = 'suspended', TRIAL = 'trial' }

export interface ITenant {
  _id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  status: TenantStatus;
  settings: ITenantSettings;
  slaConfig: ISLAConfig;
  channelConfigs: IChannelConfigs;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITenantSettings {
  maxTeamMembers: number;
  maxTicketsPerAgent: number;
  businessHours: IBusinessHours;
  autoAssign: boolean;
  routingStrategy: 'least_loaded' | 'round_robin' | 'manual';
}

export interface ISLAConfig {
  firstResponseMinutes: number;
  resolutionHours: number;
  escalationEnabled: boolean;
  breachNotifyRoles: string[];
}

export interface IChannelConfigs {
  whatsapp?: { phoneNumberId: string; accessToken: string; verifyToken: string };
  email?: { sendgridApiKey: string; fromEmail: string; webhookVerificationKey: string };
  webChat?: { widgetEnabled: boolean; widgetColor: string };
}

export interface IBusinessHours {
  timezone: string;
  schedule: { day: number; start: string; end: string; enabled: boolean }[];
}
