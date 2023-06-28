import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static register(options: RedisOptions): DynamicModule {
    const redisServiceProvider: Provider = {
      provide: RedisService,
      useValue: new RedisService(options),
    };
    return {
      module: RedisModule,
      providers: [redisServiceProvider],
      exports: [redisServiceProvider],
    };
  }

  static registerAsync(options: {
    useFactory?: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
    inject?: any[];
  }): DynamicModule {
    const redisServiceProvider: Provider = {
      provide: RedisService,
      useFactory: async (...args: any[]): Promise<RedisService> => {
        const redisOptions: RedisOptions = await options.useFactory(...args);
        return new RedisService(redisOptions);
      },
      inject: options.inject || [],
    };
    return {
      module: RedisModule,
      providers: [redisServiceProvider],
      exports: [redisServiceProvider],
    };
  }
}
