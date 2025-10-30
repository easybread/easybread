import { err, ok } from 'neverthrow';
import { z } from 'zod';

import {
  connectionById,
  connectionCreate,
  connectionDelete,
  connectionListByOrg,
  connectionSettingsUpdate,
  dataModelFetch,
  dataModelIntrospectStart,
  ownershipCheck,
} from 'saas-core';
import {
  DtoByIdSchema,
  type DtoConnection,
  DtoConnectionCreateSchema,
  DtoConnectionListSchema,
  DtoConnectionSchema,
  type DtoConnectionSettings,
  DtoConnectionSettingsUpdateSchema,
  DtoDataModelInstrospectionStartSchema,
  DtoDataModelSchema,
} from 'saas-dto';
import { ERR_CODE, errObject } from 'saas-errors';
import { redis } from 'saas-redis';

import { intoTrpcError } from '../errors/intoTrpcError';
import { authedProcedure } from '../trpcInit';

import { Cache } from './cache';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export function makeDataModelCacheKey(orgId: string, connectionId: string) {
  return `data-model:${orgId}:${connectionId}`;
}

const cache = new Cache(redis, ONE_DAY_IN_SECONDS, true);

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
      const connection = await connectionById(input.id)
        .map(redactConnection)
        .mapErr(intoTrpcError);

      if (connection.isErr()) throw connection.error;

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

  updateSettings: authedProcedure
    .input(DtoConnectionSettingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await connectionSettingsUpdate({
        id: input.id,
        orgId: ctx.userOrgs.activeOrg,
        settings: input.settings,
        name: input.name,
      })
        .map(redactConnection)
        .mapErr(intoTrpcError);

      if (result.isErr()) throw result.error;

      return result.value;
    }),

  dataModelIntrospectionStart: authedProcedure
    .input(DtoDataModelInstrospectionStartSchema)
    .mutation(async ({ input, ctx }) => {
      const cacheKey = makeDataModelCacheKey(
        ctx.userOrgs.activeOrg,
        input.connectionId,
      );

      await cache.invalidateKey(cacheKey);

      const connection = await connectionById(input.connectionId)
        .andThrough(c =>
          ownershipCheck(c, 'organizationId', ctx.userOrgs.activeOrg),
        )
        .andThen(c => {
          if (c.settings === null) {
            return err(errObject(ERR_CODE.enum.CONNECTIONS_NO_SETTINGS, c));
          }
          return ok({ ...c, settings: c.settings });
        })
        .andThen(c => {
          return dataModelIntrospectStart({
            connectionId: c.id,
            connectionName: c.name,
            orgId: ctx.userOrgs.activeOrg,
            connectionSettings: c.settings,
          });
        })
        .mapErr(intoTrpcError);

      if (connection.isErr()) throw connection.error;

      return connection.value;
    }),

  dataModelFetch: authedProcedure
    .input(DtoByIdSchema)
    .output(DtoDataModelSchema)
    .query(async ({ input, ctx }) => {
      console.time('cache.get');
      const cacheKey = makeDataModelCacheKey(ctx.userOrgs.activeOrg, input.id);
      const cached = await cache.get(cacheKey, DtoDataModelSchema);
      console.timeEnd('cache.get');
      console.log('cache hit', !!cached);

      if (cached) return cached;

      const dataModel = await dataModelFetch(
        input.id,
        ctx.userOrgs.activeOrg,
      ).mapErr(intoTrpcError);

      if (dataModel.isErr()) throw dataModel.error;

      await cache.set(cacheKey, dataModel.value);

      return dataModel.value;
    }),
};

export function redactConnection(connection: DtoConnection) {
  return {
    ...connection,
    settings: redactSettings(connection.settings),
  };
}

function redactSettings(settings: DtoConnectionSettings | null) {
  if (settings === null) return null;

  if (settings.type === 'DB_PG') {
    return {
      ...settings,
      connectionString: `${settings.connectionString.slice(0, 18)}...${settings.connectionString.slice(-70)}`,
    };
  }

  return settings;
}
