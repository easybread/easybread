import { Redis } from '@upstash/redis';
import { load } from 'ts-dotenv';

const { UPSTASH_TOKEN, UPSTASH_URL } = load({
  UPSTASH_URL: String,
  UPSTASH_TOKEN: String,
});

export const redis = new Redis({
  url: UPSTASH_URL,
  token: UPSTASH_TOKEN,
  automaticDeserialization: false,
});
