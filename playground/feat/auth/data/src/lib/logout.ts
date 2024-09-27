import { getCookieHandlers } from './getCookieHandlers';
import { AUTH_CONFIG } from './authConfig';

export function logout() {
  const { clearCookie } = getCookieHandlers();

  clearCookie(AUTH_CONFIG.accessTokenName, AUTH_CONFIG.cookieDomain);
  clearCookie(AUTH_CONFIG.refreshTokenName, AUTH_CONFIG.cookieDomain);
}
