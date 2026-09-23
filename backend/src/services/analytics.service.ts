import mongoose from 'mongoose';
import { Ticket } from '../models/ticket.model';
import { Message } from '../models/message.model';

export const analyticsService = {
  async getDashboard(tenantId: string, dateRange: { start: Date, end: Date }) {
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
    const matchStage = {
      tenantId: tenantObjectId,
      createdAt: { $gte: dateRange.start, $lte: dateRange.end }
    };

    const overview = await Ticket.aggregate([
      { $match: matchStage },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResponseMs: { $avg: { $subtract: ['$firstResponseAt', '$createdAt'] } }
      }}
    ]);

    const slaMetrics = await Ticket.aggregate([
      { $match: matchStage },
      { $group: {
        _id: null,
        total: { $sum: 1 },
        breached: {
          $sum: { $cond: [{ $eq: ['$sla.firstResponseBreached', true] }, 1, 0] }
        }
      }}
    ]);

    const channelBreakdown = await Ticket.aggregate([
      { $match: matchStage },
      { $group: {
        _id: '$channel',
        count: { $sum: 1 }
      }}
    ]);

    const hourlyVolume = await Message.aggregate([
      { $match: { tenantId: tenantObjectId, createdAt: { $gte: dateRange.start, $lte: dateRange.end } } },
      { $group: {
        _id: { hour: { $hour: '$createdAt' }, direction: '$direction' },
        count: { $sum: 1 }
      }}
    ]);

    return {
      overview,
      slaMetrics: slaMetrics[0] || { total: 0, breached: 0 },
      channelBreakdown,
      hourlyVolume
    };
  },

  async getFirstResponseTimes(tenantId: string, dateRange: { start: Date, end: Date }) {
    // Simplified histogram
    return [];
  },

  async getSLABreachTrend(tenantId: string, days: number) {
    // Simplified trend
    return [];
  }
};
