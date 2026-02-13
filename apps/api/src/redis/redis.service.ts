import { Inject, Injectable } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlMs?: number): Promise<void> {
    if (ttlMs && ttlMs > 0) {
      await this.client.set(key, value, 'PX', ttlMs);
      return;
    }
    await this.client.set(key, value);
  }

  del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
