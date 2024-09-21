import { JwtPayload, verify } from 'jsonwebtoken';
import { load } from 'ts-dotenv';
import type { AuthTokenData } from './AuthTokenData';

const { SHARED_JWT_SECRET } = load({
  SHARED_JWT_SECRET: String,
});

export function authTokenVerify(
  token?: string
): (JwtPayload & { data: AuthTokenData }) | null {
  if (!token) {
    console.log(JSON.stringify({ message: 'No token provided' }));
    return null;
  }

  try {
    return verify(token, SHARED_JWT_SECRET) as JwtPayload & {
      data: AuthTokenData;
    };
  } catch (error) {
    console.log(
      JSON.stringify({ message: 'Failed to verify token', error, token })
    );
    return null;
  }
}
