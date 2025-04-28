'use client';

import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  splitLink,
} from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { type ReactNode, cache, useState } from 'react';

import type { AppRouter } from '../server/routers/appRouter';
import { trpcTransformer } from '../trpcTransformer';

import { makeReactQueryClient } from './makeReactQueryClient';

const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') return makeReactQueryClient();

  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeReactQueryClient();

  return browserQueryClient;
}

const getUrl = cache(() => {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();

  return `${base}/api/trpc`;
});

const makeTrpcClient = cache(() => {
  const url = getUrl();
  const transformer = trpcTransformer;
  return createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition: op => isNonJsonSerializable(op.input),
        true: httpLink({ transformer, url }),
        false: httpBatchLink({ transformer, url }),
      }),
    ],
  });
});

export function TrpcReactProvider(
  props: Readonly<{
    children: ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  const [trpcClient] = useState(makeTrpcClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export { useTRPC };
