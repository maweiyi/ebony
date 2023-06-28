import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Redis as RedisClient, RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClient;
  private readonly logger: Logger = new Logger('RedisService');

  constructor(private readonly options: RedisOptions) {}

  onModuleInit() {
    this.client = new RedisClient(this.options);
    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });
    this.client.on('error', (error) => {
      this.logger.error(`Redis error: ${error}`);
    });
    this.client.on('close', () => {
      this.logger.log('Redis disconnected');
    });
  }

  async beforeApplicationShutdown() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis client quit');
    }
  }

  getClient(): RedisClient {
    return this.client;
  }
}
