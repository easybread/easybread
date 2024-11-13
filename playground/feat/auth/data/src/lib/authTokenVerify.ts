import { type JWTPayload, jwtVerify } from 'jose';
import { load } from 'ts-dotenv';

import type { AuthTokenData } from './AuthTokenData';

export async function authTokenVerify(
  token?: string
): Promise<(JWTPayload & { data: AuthTokenData }) | null> {
  const { SHARED_JWT_SECRET } = load({ SHARED_JWT_SECRET: String });

  const encodedKey = new TextEncoder().encode(SHARED_JWT_SECRET);

  if (!token) {
    console.log(JSON.stringify({ message: 'No token provided' }));
    return null;
  }

  try {
    const result = await jwtVerify<JWTPayload & { data: AuthTokenData }>(
      token,
      encodedKey,
      { algorithms: ['HS256'] }
    );

    return result.payload;
  } catch (error) {
    console.log(
      JSON.stringify({ message: 'Failed to verify token', error, token })
    );

    if (error instanceof Error) {
      console.log(error?.stack?.split('\n')?.slice(0, 10));
    }

    return null;
  }
}
