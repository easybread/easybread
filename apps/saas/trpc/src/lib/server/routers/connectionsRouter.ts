import { z } from 'zod';

import {
  connectionById,
  connectionCreate,
  connectionDelete,
  connectionListByOrg,
} from 'saas-core';
import {
  DtoByIdSchema,
  DtoConnectionCreateSchema,
  DtoConnectionListSchema,
  DtoConnectionSchema,
} from 'saas-dto';

import { intoTrpcError } from '../errors/intoTrpcError';
import { authedProcedure } from '../trpcInit';

export const connectionsRouter = {
  list: authedProcedure
    .input(z.void())
    .output(DtoConnectionListSchema)
    .query(async ({ ctx }) => {
      console.time('connectionListByOrg');
      const list = await connectionListByOrg(ctx.userOrgs.activeOrg);
      console.timeEnd('connectionListByOrg');

      if (list.isErr()) throw intoTrpcError(list.error);

      return { data: list.value };
    }),

  byId: authedProcedure
    .input(DtoByIdSchema)
    .output(DtoConnectionSchema)
    .query(async ({ input }) => {
      const connection = await connectionById(input.id);

      if (connection.isErr()) throw intoTrpcError(connection.error);

      return connection.value;
    }),

  create: authedProcedure
    .input(DtoConnectionCreateSchema)
    .output(DtoConnectionSchema)
    .mutation(async ({ input, ctx }) => {
      const connection = await connectionCreate({
        organizationId: ctx.userOrgs.activeOrg,
        ...input,
      });

      if (connection.isErr()) {
        throw intoTrpcError(connection.error, 'Failed to Create Connection');
      }

      return connection.value;
    }),

  delete: authedProcedure
    .input(DtoByIdSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await connectionDelete(input.id, ctx.userOrgs.activeOrg);
      if (result.isErr()) throw intoTrpcError(result.error);
    }),
};
