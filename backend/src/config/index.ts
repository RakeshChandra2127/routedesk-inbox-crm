import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/omnidesk',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
    token: process.env.WHATSAPP_TOKEN || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'verify_me',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'support@omnidesk.com',
  },
  defaults: {
    slaFirstResponseMinutes: parseInt(process.env.SLA_FIRST_RESPONSE_MINUTES || '15', 10),
    slaResolutionHours: parseInt(process.env.SLA_RESOLUTION_HOURS || '24', 10),
    maxTicketsPerAgent: parseInt(process.env.MAX_TICKETS_PER_AGENT || '5', 10),
    routingStrategy: process.env.ROUTING_STRATEGY || 'least_loaded',
  }
};
