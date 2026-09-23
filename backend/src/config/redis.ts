import Redis from 'ioredis';
import { config } from './index';
import { logger } from './logger';

const createRedisClient = (name: string) => {
  const client = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
  });

  client.on('connect', () => logger.info(`Redis ${name} connected`));
  client.on('error', (err) => logger.error(`Redis ${name} error: ${err}`));

  return client;
};

export const cacheClient = createRedisClient('cache');
export const queueClient = createRedisClient('queue');
