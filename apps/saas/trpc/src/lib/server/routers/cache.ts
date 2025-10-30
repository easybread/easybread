import type { Redis } from '@upstash/redis';
import SuperJSON from 'superjson';
import type { ZodTypeAny, z } from 'zod';

export class Cache<T extends Redis> {
  private readonly redis: T;
  private readonly ttl: number;
  private readonly localMode: boolean;
  private readonly localCache: Map<string, string> = new Map();

  constructor(redis: T, ttl: number, localMode: boolean) {
    this.redis = redis;
    this.ttl = ttl;
    this.localMode = localMode;
  }

  async get<TSchema extends ZodTypeAny>(
    key: string,
    schema: TSchema,
  ): Promise<z.infer<TSchema> | null> {
    const value = await this.getRawValue(key);
    if (value === null) return null;

    const parsed = schema.safeParse(SuperJSON.parse(value));
    if (!parsed.success) return null;

    return parsed.data;
  }

  async set<T>(key: string, value: T) {
    await this.setRawValue(key, SuperJSON.stringify(value));
  }

  async invalidateKey(key: string) {
    if (this.localMode) {
      this.localCache.delete(key);
    } else {
      await this.redis.del(key);
    }
  }

  private async getRawValue(key: string) {
    if (this.localMode) {
      return (
        this.localCache.get(key) ?? (await this.redis.get<string>(key)) ?? null
      );
    }
    return this.redis.get<string>(key);
  }

  private async setRawValue(key: string, value: string) {
    this.localCache.set(key, value);
    await this.redis.set(key, value, { ex: this.ttl });
  }
}
