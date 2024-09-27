import { cache } from 'react';
import { getCookieHandlers } from './getCookieHandlers';
import { AUTH_CONFIG } from './authConfig';
import { authTokenVerify } from './authTokenVerify';
import type { Authorized, Unauthorized } from './authorize';

export const authStatusGet = cache((): Authorized | Unauthorized => {
  const { getCookie } = getCookieHandlers();

  const accessToken = getCookie(AUTH_CONFIG.accessTokenName);

  if (accessToken) {
    const decodedAT = authTokenVerify(accessToken);
    if (decodedAT) return { authorized: true, data: decodedAT.data };
  }

  return { authorized: false };
});
