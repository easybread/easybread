import { cookies } from 'next/headers';

const NINETY_DAYS_IN_MS = 60 * 60 * 24 * 90 * 1000;

export type SetCookieFn = (
  name: string,
  value: string,
  expireTimeMs: number,
  domain: string
) => void;

export type GetCookieFn = (name: string) => string | undefined;

export type CookieHandlers = {
  setCookie: SetCookieFn;
  getCookie: GetCookieFn;
  clearCookie: (name: string, domain?: string) => void;
};

export function getCookieHandlers(): CookieHandlers {
  const cookieStore = cookies();

  const getCookie = (name: string) => cookieStore.get(name)?.value;

  const setCookie = (
    name: string,
    value: string,
    expireTimeMs: number = NINETY_DAYS_IN_MS,
    domain: string
  ) => {
    cookieStore.set(name, value, {
      httpOnly: true,
      maxAge: expireTimeMs,
      path: '/',
      domain,
    });
  };

  const clearCookie = (name: string, domain = 'localhost') => {
    cookieStore.set(name, '', {
      httpOnly: true,
      maxAge: -1,
      path: '/',
      domain,
    });
  };

  return { getCookie, setCookie, clearCookie };
}
