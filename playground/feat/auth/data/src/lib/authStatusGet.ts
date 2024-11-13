import { cache } from 'react';
import { getCookieHandlers } from './getCookieHandlers';
import { AUTH_CONFIG } from './authConfig';
import { authTokenVerify } from './authTokenVerify';
import type { Authorized } from './authorized';
import type { Unauthorized } from './unauthorized';

export const authStatusGet = cache(
  async (): Promise<Authorized | Unauthorized> => {
    const { getCookie } = await getCookieHandlers();

    const refreshToken = getCookie(AUTH_CONFIG.refreshTokenName);

    if (refreshToken) {
      const decodedRT = await authTokenVerify(refreshToken);
      if (decodedRT?.data) return { authorized: true, data: decodedRT.data };
    }

    return { authorized: false };
  }
);
