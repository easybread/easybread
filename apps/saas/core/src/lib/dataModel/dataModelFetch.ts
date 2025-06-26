import { and, eq } from 'drizzle-orm';
import { err, fromPromise, ok } from 'neverthrow';

import type { DataModelDef } from '@easybread/data-model';

import {
  dataModelEntities,
  dataModelEnums,
  dataModelRelations,
  dataModels,
  saasdb,
} from 'saas-db';
import type {
  DataModelEntitySelect,
  DataModelEnumSelect,
  DataModelRelationSelect,
  DataModelSelect,
} from 'saas-db/types';
import { ERR_CODE, errDbQueryFailed, errObject } from 'saas-errors';

export function dataModelFetch(connectionId: string, orgId: string) {
  const dataModel = fromPromise(
    saasdb
      .select()
      .from(dataModels)
      .where(
        and(
          eq(dataModels.connectionId, connectionId),
          eq(dataModels.orgId, orgId),
        ),
      )
      .leftJoin(dataModelEnums, eq(dataModels.id, dataModelEnums.dataModelId))
      .leftJoin(
        dataModelEntities,
        eq(dataModels.id, dataModelEntities.dataModelId),
      )
      .leftJoin(
        dataModelRelations,
        eq(dataModels.id, dataModelRelations.dataModelId),
      ),
    errDbQueryFailed,
  ).andThen(buildDataModelDef);

  return dataModel;
}

export function buildDataModelDef(
  results: {
    dataModels: DataModelSelect;
    dataModelEnums: DataModelEnumSelect | null;
    dataModelEntities: DataModelEntitySelect | null;
    dataModelRelations: DataModelRelationSelect | null;
  }[],
) {
  console.log('-------------------- buildDataModelDef --------------------');
  console.log(JSON.stringify(results, null, 2));
  console.log('-------------------- buildDataModelDef --------------------');

  const dataModel = results[0].dataModels;

  if (!dataModel) {
    return err(errObject(ERR_CODE.enum.DB_NOT_FOUND, 'Data model not found'));
  }

  const enums = results
    .map(result => result.dataModelEnums?.def)
    .filter(d => !!d);

  const entities = results
    .map(result => result.dataModelEntities?.def)
    .filter(d => !!d);

  const relations = results
    .map(result => result.dataModelRelations?.def)
    .filter(d => !!d);

  return ok({
    ...dataModel,
    def: {
      name: dataModel.name,
      namespaces: dataModel.namespaces,
      entities,
      relations,
      enums,
    },
  } satisfies DataModelSelect & { def: DataModelDef });
}
