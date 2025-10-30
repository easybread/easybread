import { and, eq } from 'drizzle-orm';
import { err, fromPromise, ok } from 'neverthrow';

import type {
  DataModelDef,
  EntityDef,
  EnumDef,
  RelationDef,
} from '@easybread/data-model';

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
  console.log(`${results.length} results`);

  const dataModel = results[0]?.dataModels;

  if (!dataModel) {
    return err(errObject(ERR_CODE.enum.DB_NOT_FOUND, 'Data model not found'));
  }

  const enums = new Map<string, EnumDef>();
  const entities = new Map<string, EntityDef>();
  const relations = new Map<string, RelationDef<EntityDef, EntityDef>>();

  for (const result of results) {
    if (result.dataModelEnums?.def) {
      enums.set(
        `${result.dataModelEnums.namespace}:${result.dataModelEnums.name}`,
        result.dataModelEnums.def,
      );
    }
    if (result.dataModelEntities?.def) {
      entities.set(
        `${result.dataModelEntities.namespace}:${result.dataModelEntities.name}`,
        result.dataModelEntities.def,
      );
    }
    if (result.dataModelRelations?.def) {
      relations.set(
        `${result.dataModelRelations.def.from.namespace}:${result.dataModelRelations.def.from.entity}->${result.dataModelRelations.def.to.namespace}:${result.dataModelRelations.def.to.entity}`,
        result.dataModelRelations.def,
      );
    }
  }

  return ok({
    ...dataModel,
    def: {
      name: dataModel.name,
      namespaces: dataModel.namespaces,
      entities: Array.from(entities.values()),
      relations: Array.from(relations.values()),
      enums: Array.from(enums.values()),
    },
  } satisfies DataModelSelect & { def: DataModelDef });
}
