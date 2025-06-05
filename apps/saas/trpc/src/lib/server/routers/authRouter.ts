import { z } from 'zod';

import { organizationActiveSet } from 'saas-core';
import { DtoAuthInfoSchema, DtoByIdSchema } from 'saas-dto';

import { authedProcedure } from '../trpcInit';

export const authRouter = {
  info: authedProcedure
    .input(z.void())
    .output(DtoAuthInfoSchema)
    .query(async opts => {
      return {
        user: opts.ctx.user,
        userOrgs: opts.ctx.userOrgs,
      };
    }),

  setActiveOrg: authedProcedure
    .input(DtoByIdSchema)
    .mutation(async ({ ctx, input }) => {
      await organizationActiveSet(ctx.user.id, input.id);
    }),
};
