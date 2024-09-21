import { authenticate } from './authenticate';
import type { AuthTokenData } from './AuthTokenData';
import { AUTH_CONFIG } from './authConfig';
import { authTokenVerify } from './authTokenVerify';

import { getCookieHandlers } from './getCookieHandlers';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export type Authorized = {
  authorized: true;
  data: AuthTokenData;
};

export type Unauthorized = {
  authorized: false;
};

export const authorize = cache(async function authorize(): Promise<Authorized> {
  const { getCookie, setCookie } = getCookieHandlers();

  const accessToken = getCookie(AUTH_CONFIG.accessTokenName);

  if (accessToken) {
    const decodedAT = authTokenVerify(accessToken);
    if (decodedAT) return { authorized: true, data: decodedAT.data };
  }

  // try to refresh the token
  const refreshToken = getCookie(AUTH_CONFIG.refreshTokenName);
  if (!refreshToken) return redirect('/login');

  const decodedRT = authTokenVerify(refreshToken);
  if (!decodedRT) return redirect('/login');

  authenticate({
    setCookie,
    data: decodedRT.data,
  });

  return { authorized: true, data: decodedRT.data };
});
