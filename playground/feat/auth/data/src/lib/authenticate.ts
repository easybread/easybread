import type { AuthTokenData } from './AuthTokenData';
import { AUTH_CONFIG } from './authConfig';
import { authTokenEncode } from './authTokenEncode';

interface AuthenticateParams {
  data: AuthTokenData;
  setCookie: (
    name: string,
    value: string,
    expireTimeMs: number,
    domain: string,
  ) => void;
}

export async function authenticate(params: AuthenticateParams) {
  const { data, setCookie } = params;

  const {
    accessTokenExpireTimeSec,
    refreshTokenExpireTimeSec,
    refreshTokenName,
    accessTokenName,
    cookieDomain,
  } = AUTH_CONFIG;

  setCookie(
    accessTokenName,
    await authTokenEncode({
      data,
      expireTimeSec: accessTokenExpireTimeSec,
    }),
    accessTokenExpireTimeSec * 1000,
    cookieDomain,
  );

  setCookie(
    refreshTokenName,
    await authTokenEncode({
      data,
      expireTimeSec: refreshTokenExpireTimeSec,
    }),
    refreshTokenExpireTimeSec * 1000,
    cookieDomain,
  );
}
