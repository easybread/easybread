import { fromPromise } from 'neverthrow';

import { IntrospectionError, introspectPostgres } from '@easybread/data-model';

import { PG_CONNECTION_TYPE } from 'saas-db/enums';
import type { ConnectionSettingsJsonb } from 'saas-db/types';
import { ERR_CODE, errObject } from 'saas-errors';

import { dataModelUpsert } from './dataModelUpsert';

interface DataModelInstrospectStartOptions {
  connectionId: string;
  connectionName: string | null;
  orgId: string;
  connectionSettings: ConnectionSettingsJsonb;
}

export function dataModelIntrospectStart({
  connectionId,
  connectionName,
  orgId,
  connectionSettings,
}: DataModelInstrospectStartOptions) {
  // TODO: move this to a separate workflow
  // TODO: manage the state of instrospection throughout the process
  // TODO: implement realtime updates to the frontend

  return fromPromise(
    introspect(connectionSettings, connectionName),
    handleIntrospectionError,
  ).andThen(dataModelDef => dataModelUpsert(connectionId, orgId, dataModelDef));
}

export async function introspect(
  connectionSettings: ConnectionSettingsJsonb,
  connectionName: string | null,
) {
  switch (connectionSettings.type) {
    case PG_CONNECTION_TYPE.DB_PG:
      return introspectPostgres({
        connectionString: connectionSettings.connectionString,
        databaseName: connectionName ?? undefined,
      });

    default:
      throw errObject(ERR_CODE.enum.CONNECTIONS_UNSUPPORTED_TYPE);
  }
}

export function handleIntrospectionError(e: unknown) {
  if (e instanceof IntrospectionError) {
    return errObject(ERR_CODE.enum.DATA_MODEL_INTROSPECTION_FAILED, e);
  }

  return errObject(ERR_CODE.enum.CORE_UNKNOWN_ERROR, e);
}
