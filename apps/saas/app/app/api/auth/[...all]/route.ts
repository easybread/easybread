import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from 'saas-auth/server';

export const dynamic = 'force-dynamic';

export const { GET, POST } = toNextJsHandler(auth.handler);
