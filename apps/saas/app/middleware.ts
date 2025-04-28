import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  if (isPublicPath(req.nextUrl.pathname)) return NextResponse.next();

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/signin', req.url), {
      headers: {
        'set-cookie': `post-auth-path=${req.nextUrl.pathname}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      },
    });
  }

  console.log('cookie found!');

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - health (health check routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        '/((?!api|health|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    },
  ],
};

function isPublicPath(path: string) {
  return ['/signin', '/signup'].some(publicPath => path.startsWith(publicPath));
}
