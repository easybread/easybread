import { uuidV7 } from '@space-architects/util-drizzle';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import type { EntityDef, EnumDef, RelationDef } from '@easybread/data-model';

import { connections, organizations } from './schema';

// -----------------------------------------------------------------------------
// DataModel Tables
// -----------------------------------------------------------------------------

export const dataModels = pgTable(
  'dataModels',
  {
    id: uuidV7('id').primaryKey(),
    orgId: uuidV7('orgId').references(() => organizations.id, {
      onDelete: 'cascade',
    }),
    connectionId: uuidV7('connectionId').references(() => connections.id, {
      onDelete: 'cascade',
    }),

    name: varchar('name', { length: 255 }).notNull(),
    version: integer('version').notNull().default(1),

    namespaces: jsonb('namespaces').$type<string[]>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  table => [
    index('data_models_org_id_connection_id_name_idx').on(
      table.orgId,
      table.connectionId,
    ),
  ],
);

export const dataModelInstrospectionStatusEnum = pgEnum(
  'dataModelInstrospectionStatusEnum',
  ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
);

export const dataModelInstrospections = pgTable(
  'dataModelInstrospections',
  {
    id: uuidV7('id').primaryKey(),
    status: dataModelInstrospectionStatusEnum().notNull().default('PENDING'),
    dataModelId: uuidV7('dataModelId').references(() => dataModels.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  table => [
    index('data_model_instrospections_data_model_id_status_idx').on(
      table.dataModelId,
      table.status,
    ),
  ],
);

export const dataModelEntities = pgTable(
  'dataModelEntities',
  {
    dataModelId: uuidV7('dataModelId').references(() => dataModels.id, {
      onDelete: 'cascade',
    }),

    name: text('name').notNull(),
    namespace: text('namespace').notNull(),

    def: jsonb('def').$type<EntityDef>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  table => [
    primaryKey({ columns: [table.dataModelId, table.namespace, table.name] }),
    index('data_model_entities_namespace_name_idx').on(
      table.namespace,
      table.name,
    ),
  ],
);

export const dataModelEnums = pgTable(
  'dataModelEnums',
  {
    dataModelId: uuidV7('dataModelId').references(() => dataModels.id, {
      onDelete: 'cascade',
    }),

    name: text('name').notNull(),
    namespace: text('namespace').notNull(),

    def: jsonb('def').$type<EnumDef>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  table => [
    primaryKey({ columns: [table.dataModelId, table.namespace, table.name] }),
    index('data_model_enums_namespace_name_idx').on(
      table.namespace,
      table.name,
    ),
  ],
);

export const dataModelRelations = pgTable(
  'dataModelRelations',
  {
    dataModelId: uuidV7('dataModelId').references(() => dataModels.id, {
      onDelete: 'cascade',
    }),

    relationId: text('relationId').notNull(),

    def: jsonb('def').$type<RelationDef<EntityDef, EntityDef>>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  table => [
    primaryKey({ columns: [table.dataModelId, table.relationId] }),
    index('data_model_relations_relation_id_idx').on(table.relationId),
  ],
);
