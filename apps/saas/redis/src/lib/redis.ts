import { Redis } from '@upstash/redis';
import { load } from 'ts-dotenv';

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = load({
  UPSTASH_REDIS_REST_URL: String,
  UPSTASH_REDIS_REST_TOKEN: String,
});

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
  automaticDeserialization: false,
});
