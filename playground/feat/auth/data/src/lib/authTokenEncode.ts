import { load } from 'ts-dotenv';
import { SignJWT } from 'jose';

interface AuthTokenEncodeParams<TData extends object> {
  data: TData;
  expireTimeSec: number;
  [key: string]: unknown;
}

export function authTokenEncode<TData extends Record<string, unknown>>({
  data,
  expireTimeSec,
}: AuthTokenEncodeParams<TData>): Promise<string> {
  const { SHARED_JWT_SECRET } = load({ SHARED_JWT_SECRET: String });

  const encodedKey = new TextEncoder().encode(SHARED_JWT_SECRET);

  return new SignJWT({ data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expireTimeSec}sec`)
    .sign(encodedKey);
}
