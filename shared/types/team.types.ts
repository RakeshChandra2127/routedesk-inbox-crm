export enum UserRole { SUPER_ADMIN = 'super_admin', TENANT_ADMIN = 'tenant_admin', AGENT = 'agent', MANAGER = 'manager', VIEWER = 'viewer' }
export enum UserStatus { ACTIVE = 'active', INVITED = 'invited', DEACTIVATED = 'deactivated' }
export enum PresenceStatus { ONLINE = 'online', OFFLINE = 'offline', BUSY = 'busy', AWAY = 'away' }

export interface ITeamMember {
  _id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  presence: IPresenceState;
  workload: IWorkloadState;
  skills: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPresenceState {
  status: PresenceStatus;
  lastSeenAt: Date;
  currentSocketId?: string;
  statusMessage?: string;
}

export interface IWorkloadState {
  activeTickets: number;
  maxTickets: number;
  ticketsResolvedToday: number;
  avgResponseTimeMs: number;
}

export interface ITeamMemberPublic {
  _id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  presence: IPresenceState;
  workload: IWorkloadState;
}

export interface IAuthPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
}
