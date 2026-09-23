import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ITeamMember extends Document {
  tenantId: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: 'super_admin' | 'tenant_admin' | 'agent' | 'manager' | 'viewer';
  status: 'active' | 'inactive';
  presence: {
    status: 'online' | 'offline' | 'busy' | 'away';
    lastSeenAt?: Date;
    currentSocketId?: string;
    statusMessage?: string;
  };
  workload: {
    activeTickets: number;
    maxTickets: number;
    ticketsResolvedToday: number;
    avgResponseTimeMs: number;
  };
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['super_admin', 'tenant_admin', 'agent', 'manager', 'viewer'], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    presence: {
      status: { type: String, enum: ['online', 'offline', 'busy', 'away'], default: 'offline' },
      lastSeenAt: { type: Date },
      currentSocketId: { type: String },
      statusMessage: { type: String },
    },
    workload: {
      activeTickets: { type: Number, default: 0 },
      maxTickets: { type: Number, default: 5 },
      ticketsResolvedToday: { type: Number, default: 0 },
      avgResponseTimeMs: { type: Number, default: 0 },
    },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

teamMemberSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

teamMemberSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

teamMemberSchema.index({ tenantId: 1, email: 1 }, { unique: true });
teamMemberSchema.index({ tenantId: 1, 'presence.status': 1 });
teamMemberSchema.index({ tenantId: 1, role: 1 });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
