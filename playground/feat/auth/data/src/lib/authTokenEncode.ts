import { sign } from 'jsonwebtoken';
import { load } from 'ts-dotenv';

interface AuthTokenEncodeParams<TData extends object> {
  data: TData;
  expireTimeSec: number;
}

export function authTokenEncode<TData extends object>({
  data,
  expireTimeSec,
}: AuthTokenEncodeParams<TData>): string {
  const { SHARED_JWT_SECRET } = load({ SHARED_JWT_SECRET: String });

  return sign({ data }, SHARED_JWT_SECRET, { expiresIn: expireTimeSec });
}
