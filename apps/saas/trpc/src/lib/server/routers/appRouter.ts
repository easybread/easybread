import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';

import { baseProcedure, router } from '../trpcInit';

import { authRouter } from './authRouter';
import { connectionsRouter } from './connectionsRouter';

export const appRouter = router({
  connections: connectionsRouter,
  auth: authRouter,
  hello: baseProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(async ({ input }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        greeting: `Hello ${input.name ?? 'world'}`,
      };
    }),
});

export type AppRouter = typeof appRouter;

export type AppRouterInputs = inferRouterInputs<AppRouter>;
export type AppRouterOutputs = inferRouterOutputs<AppRouter>;
