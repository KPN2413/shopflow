import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "../redis/redis.module";

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async check() {
    await this.dataSource.query("SELECT 1");
    await this.redis.ping();
    return { ok: true };
  }
}
