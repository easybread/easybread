import { NextRequest, NextResponse } from 'next/server';
import {
  authenticate,
  authStatusGet,
  clearAuthCookies,
  getCookieHandlers,
} from 'playground-feat-auth-data';

export default async function middleware(req: NextRequest) {
  const authStatus = await authStatusGet();

  if (authStatus.authorized) {
    // refresh token
    const { setCookie } = await getCookieHandlers();
    await authenticate({ setCookie, data: authStatus.data });
  } else if (req.nextUrl.pathname !== '/login') {
    await clearAuthCookies();
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
