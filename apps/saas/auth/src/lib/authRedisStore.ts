import 'server-only';

import { SecondaryStorage } from 'better-auth';

import { redis } from 'saas-redis';

export const AuthRedisStore: SecondaryStorage = {
  get: async key => redis.get(key),
  set: async (key, value, ttl) => {
    if (ttl) return redis.set(key, value, { ex: ttl });
    return redis.set(key, value);
  },
  delete: async key => {
    await redis.del(key);
  },
};
