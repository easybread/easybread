import 'server-only';

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { headers } from 'next/headers';
import { cache } from 'react';

import { makeReactQueryClient } from '../client/makeReactQueryClient';

import { appRouter } from './routers/appRouter';
import { createTrpcContext } from './trpcContext';

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryServerClient = cache(makeReactQueryClient);

const createTrpcContextInServerComponent = cache(async () => {
  console.log('CREATING_TRPC_CONTEXT:SERVER_COMPONENT');
  return createTrpcContext({ headers: await headers() });
});

export const trpcServer = createTRPCOptionsProxy({
  ctx: createTrpcContextInServerComponent,
  router: appRouter,
  queryClient: getQueryServerClient,
});
