import { cacheClient } from '../config/redis';
import { TeamMember } from '../models/team-member.model';
import { logger } from '../config/logger';

export const presenceService = {
  async setOnline(tenantId: string, userId: string, socketId: string) {
    const presenceData = JSON.stringify({ status: 'online', socketId, lastSeenAt: new Date().toISOString() });
    await cacheClient.hset(`presence:${tenantId}`, userId, presenceData);
    
    await TeamMember.findByIdAndUpdate(userId, {
      'presence.status': 'online',
      'presence.currentSocketId': socketId,
      'presence.lastSeenAt': new Date(),
    });
    logger.info(`User ${userId} went online`);
  },

  async setOffline(tenantId: string, userId: string) {
    await cacheClient.hdel(`presence:${tenantId}`, userId);
    
    await TeamMember.findByIdAndUpdate(userId, {
      'presence.status': 'offline',
      $unset: { 'presence.currentSocketId': '' },
      'presence.lastSeenAt': new Date(),
    });
    logger.info(`User ${userId} went offline`);
  },

  async setStatus(tenantId: string, userId: string, status: 'busy' | 'away') {
    const existingStr = await cacheClient.hget(`presence:${tenantId}`, userId);
    if (existingStr) {
      const existing = JSON.parse(existingStr);
      existing.status = status;
      await cacheClient.hset(`presence:${tenantId}`, userId, JSON.stringify(existing));
    }
    
    await TeamMember.findByIdAndUpdate(userId, {
      'presence.status': status,
    });
  },

  async getOnlineAgents(tenantId: string): Promise<string[]> {
    const presences = await cacheClient.hgetall(`presence:${tenantId}`);
    return Object.keys(presences);
  },

  async getPresenceMap(tenantId: string): Promise<Record<string, any>> {
    const presences = await cacheClient.hgetall(`presence:${tenantId}`);
    const map: Record<string, any> = {};
    for (const [userId, dataStr] of Object.entries(presences)) {
      map[userId] = JSON.parse(dataStr);
    }
    return map;
  },

  async isAvailable(tenantId: string, userId: string): Promise<boolean> {
    const presenceStr = await cacheClient.hget(`presence:${tenantId}`, userId);
    if (!presenceStr) return false;
    
    const presence = JSON.parse(presenceStr);
    if (presence.status !== 'online') return false;

    const agent = await TeamMember.findById(userId);
    if (!agent) return false;

    return agent.workload.activeTickets < agent.workload.maxTickets;
  }
};
