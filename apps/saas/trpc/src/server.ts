export { createCallerFactory } from './lib/server/trpcInit';
export { type TrpcContext, createTrpcContext } from './lib/server/trpcContext';

export { appRouter } from './lib/server/routers/appRouter';

export type {
  AppRouter,
  AppRouterInputs,
  AppRouterOutputs,
} from './lib/server/routers/appRouter';

export { trpcServer, getQueryServerClient } from './lib/server/trpcServer';
export { trpcPrefetch } from './lib/server/ssr-util/trpcPrefetch';
export { trpcFetchQuery } from './lib/server/ssr-util/trpcFetchQuery';
export { TrpcHydrateClient } from './lib/server/ssr-util/TrpcHydrateClient';
