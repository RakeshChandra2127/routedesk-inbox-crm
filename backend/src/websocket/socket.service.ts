import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { presenceService } from '../services/presence.service';
import { routingService } from '../services/routing.service';
import { messageService } from '../services/message.service';
import { logger } from '../config/logger';

let io: Server;

export const socketService = {
  init(server: HttpServer) {
    io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] }
    });

    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as any;
        socket.data.user = {
          userId: decoded.userId,
          tenantId: decoded.tenantId,
          role: decoded.role
        };
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', async (socket: Socket) => {
      const { tenantId, userId } = socket.data.user;
      
      socket.join(`tenant:${tenantId}`);
      socket.join(`user:${userId}`);

      await presenceService.setOnline(tenantId, userId, socket.id);
      this.emitPresenceUpdate(tenantId);
      
      const bulkPresence = await presenceService.getPresenceMap(tenantId);
      socket.emit('PRESENCE_BULK', bulkPresence);

      socket.on('presence:update', async (data) => {
        if (data.status === 'busy' || data.status === 'away') {
          await presenceService.setStatus(tenantId, userId, data.status);
          this.emitPresenceUpdate(tenantId);
        }
      });

      socket.on('ticket:join', (ticketId) => {
        socket.join(`ticket:${ticketId}`);
      });

      socket.on('ticket:leave', (ticketId) => {
        socket.leave(`ticket:${ticketId}`);
      });

      socket.on('message:read', async (ticketId) => {
        await messageService.markAsRead(tenantId, ticketId, userId);
      });

      socket.on('typing:start', (ticketId) => {
        socket.to(`ticket:${ticketId}`).emit('typing:start', { userId, ticketId });
      });

      socket.on('typing:stop', (ticketId) => {
        socket.to(`ticket:${ticketId}`).emit('typing:stop', { userId, ticketId });
      });

      socket.on('disconnect', async () => {
        await presenceService.setOffline(tenantId, userId);
        this.emitPresenceUpdate(tenantId);
        await routingService.rebalanceTickets(tenantId);
      });
    });

    logger.info('Socket.io initialized');
  },

  emitToTenant(tenantId: string, event: string, data: any) {
    if (io) io.to(`tenant:${tenantId}`).emit(event, data);
  },

  emitToUser(tenantId: string, userId: string, event: string, data: any) {
    if (io) io.to(`user:${userId}`).emit(event, data);
  },

  emitToTicket(tenantId: string, ticketId: string, event: string, data: any) {
    if (io) io.to(`ticket:${ticketId}`).emit(event, data);
  },

  async emitPresenceUpdate(tenantId: string) {
    const presences = await presenceService.getPresenceMap(tenantId);
    this.emitToTenant(tenantId, 'PRESENCE_UPDATE', presences);
  },
  
  close() {
    if (io) io.close();
  }
};
