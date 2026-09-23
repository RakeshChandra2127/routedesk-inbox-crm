import jwt from 'jsonwebtoken';
import { Tenant } from '../models/tenant.model';
import { TeamMember } from '../models/team-member.model';
import { config } from '../config';
import { AppError } from '../utils/app-error';
import { generateSlug } from '../utils/helpers';

export const authService = {
  async register(data: any) {
    const slug = generateSlug(data.tenantName);
    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
      throw new AppError(400, 'Tenant name already exists', 'TENANT_EXISTS');
    }

    const tenant = await Tenant.create({
      name: data.tenantName,
      slug,
      plan: 'free',
    });

    const user = await TeamMember.create({
      tenantId: tenant._id,
      email: data.email,
      passwordHash: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: `${data.firstName} ${data.lastName}`,
      role: 'tenant_admin',
    });

    const token = this.generateToken(user);
    return { tenant, user, token };
  },

  async login(email: string, password: string) {
    const user = await TeamMember.findOne({ email });
    if (!user) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    if (user.status !== 'active') {
      throw new AppError(403, 'Account is inactive', 'ACCOUNT_INACTIVE');
    }

    const token = this.generateToken(user);
    return { user, token };
  },

  generateToken(user: any) {
    return jwt.sign(
      { userId: user._id, tenantId: user.tenantId, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  },
};
