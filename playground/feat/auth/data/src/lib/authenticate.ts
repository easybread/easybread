import { AUTH_CONFIG } from './authConfig';
import { authTokenEncode } from './authTokenEncode';
import type { AuthTokenData } from './AuthTokenData';

interface AuthenticateParams {
  data: AuthTokenData;
  setCookie: (
    name: string,
    value: string,
    expireTimeMs: number,
    domain: string
  ) => void;
}

export function authenticate(params: AuthenticateParams) {
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
    authTokenEncode({
      data,
      expireTimeSec: accessTokenExpireTimeSec,
    }),
    accessTokenExpireTimeSec * 1000,
    cookieDomain
  );

  setCookie(
    refreshTokenName,
    authTokenEncode({
      data,
      expireTimeSec: refreshTokenExpireTimeSec,
    }),
    refreshTokenExpireTimeSec * 1000,
    cookieDomain
  );
}
