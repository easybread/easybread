import { and, eq, inArray, not, or, sql } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { DataModelDef } from '@easybread/data-model';

import {
  dataModelEntities,
  dataModelEnums,
  dataModelRelations,
  dataModels,
  saasdb,
} from 'saas-db';
import type {
  DataModelEntityInsert,
  DataModelEnumInsert,
  DataModelRelationInsert,
} from 'saas-db/types';
import { errDbQueryFailed } from 'saas-errors';

export function dataModelUpsert(
  connectionId: string,
  orgId: string,
  dataModelDef: DataModelDef,
) {
  const { entities, enums, name, namespaces, relations } = dataModelDef;

  return fromPromise(
    saasdb.transaction(async tx => {
      const [dataModel] = await tx
        .insert(dataModels)
        .values({
          orgId,
          connectionId,
          name,
          namespaces,
        })
        .onConflictDoUpdate({
          target: [dataModels.connectionId, dataModels.orgId],
          set: {
            version: sql`${dataModels.version} + 1`,
            namespaces,
            name,
          },
        })
        .returning({ id: dataModels.id });

      await Promise.all([
        // upsert current model components

        tx
          .insert(dataModelEntities)
          .values(
            entities.map(
              e =>
                ({
                  def: e,
                  name: e.name,
                  namespace: e.namespace,
                  dataModelId: dataModel.id,
                }) satisfies DataModelEntityInsert,
            ),
          )
          .onConflictDoUpdate({
            target: [
              dataModelEntities.dataModelId,
              dataModelEntities.namespace,
              dataModelEntities.name,
            ],
            set: { def: sql`excluded.def` },
          }),

        tx
          .insert(dataModelEnums)
          .values(
            enums.map(
              e =>
                ({
                  def: e,
                  name: e.name,
                  namespace: e.namespace,
                  dataModelId: dataModel.id,
                }) satisfies DataModelEnumInsert,
            ),
          )
          .onConflictDoUpdate({
            target: [
              dataModelEnums.dataModelId,
              dataModelEnums.namespace,
              dataModelEnums.name,
            ],
            set: { def: sql`excluded.def` },
          }),

        tx
          .insert(dataModelRelations)
          .values(
            relations.map(
              r =>
                ({
                  def: r,
                  relationId: r.id,
                  dataModelId: dataModel.id,
                }) satisfies DataModelRelationInsert,
            ),
          )
          .onConflictDoUpdate({
            target: [
              dataModelRelations.dataModelId,
              dataModelRelations.relationId,
            ],
            set: { def: sql`excluded.def` },
          }),

        // delete removed components

        entities.length > 0
          ? tx
              .delete(dataModelEntities)
              .where(
                and(
                  eq(dataModelEntities.dataModelId, dataModel.id),
                  not(
                    or(
                      ...entities.map(entity =>
                        and(
                          eq(dataModelEntities.namespace, entity.namespace),
                          eq(dataModelEntities.name, entity.name),
                        ),
                      ),
                    ) as any,
                  ),
                ),
              )
          : tx
              .delete(dataModelEntities)
              .where(eq(dataModelEntities.dataModelId, dataModel.id)),

        enums.length > 0
          ? tx
              .delete(dataModelEnums)
              .where(
                and(
                  eq(dataModelEnums.dataModelId, dataModel.id),
                  not(
                    or(
                      ...enums.map(enumDef =>
                        and(
                          eq(dataModelEnums.namespace, enumDef.namespace),
                          eq(dataModelEnums.name, enumDef.name),
                        ),
                      ),
                    ) as any,
                  ),
                ),
              )
          : tx
              .delete(dataModelEnums)
              .where(eq(dataModelEnums.dataModelId, dataModel.id)),

        relations.length > 0
          ? tx.delete(dataModelRelations).where(
              and(
                eq(dataModelRelations.dataModelId, dataModel.id),
                not(
                  inArray(
                    dataModelRelations.relationId,
                    relations.map(r => r.id),
                  ),
                ),
              ),
            )
          : tx
              .delete(dataModelRelations)
              .where(eq(dataModelRelations.dataModelId, dataModel.id)),
      ]);

      return dataModel;
    }),

    errDbQueryFailed,
  );
}
