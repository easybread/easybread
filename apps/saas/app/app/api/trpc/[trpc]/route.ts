import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';
import { cache } from 'react';

import { appRouter, createTrpcContext } from 'saas-trpc/server';

const createTrpcContextInFetchHandler = cache(
  (opts: FetchCreateContextFnOptions) => {
    console.log('CREATING_TRPC_CONTEXT:ROUTE_HANDLER');
    return createTrpcContext({ headers: opts.req.headers });
  },
);

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTrpcContextInFetchHandler,
  });

export const dynamic = 'force-dynamic';

export { handler as GET, handler as POST };
