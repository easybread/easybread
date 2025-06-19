import { uuidV7 } from '@space-architects/util-drizzle';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import type { EntityDef, EnumDef, RelationDef } from '@easybread/data-model';

import { connections, organizations } from './schema.js';

// -----------------------------------------------------------------------------
// DataModel Tables
// -----------------------------------------------------------------------------

export const dataModels = pgTable(
  'dataModels',
  {
    id: uuidV7('id').primaryKey(),
    organizationId: uuidV7('organizationId')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    connectionId: uuidV7('connectionId').references(() => connections.id, {
      onDelete: 'cascade',
    }),

    name: text('name').notNull(),

    version: integer('version').notNull().default(1),
    isActive: boolean('isActive').notNull().default(true),

    namespaces: jsonb('namespaces').$type<string[]>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  table => [
    uniqueIndex('data_models_org_name_idx').on(
      table.organizationId,
      table.name,
    ),
    index('data_models_org_idx').on(table.organizationId),
    index('data_models_source_connection_idx').on(table.connectionId),
  ],
);

export const dataModelEntities = pgTable(
  'dataModelEntities',
  {
    id: uuidV7('id').primaryKey(),
    dataModelId: uuidV7('dataModelId')
      .notNull()
      .references(() => dataModels.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),
    namespace: text('namespace'),

    def: jsonb('def').$type<EntityDef>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  table => [
    uniqueIndex('data_model_entities_model_name_namespace_idx').on(
      table.dataModelId,
      table.name,
      table.namespace,
    ),
    index('data_model_entities_model_idx').on(table.dataModelId),
    index('data_model_entities_namespace_idx').on(table.namespace),
  ],
);

export const dataModelEnums = pgTable(
  'data_model_enums',
  {
    id: uuidV7('id').primaryKey(),
    dataModelId: uuidV7('dataModelId')
      .notNull()
      .references(() => dataModels.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),
    namespace: text('namespace'),

    def: jsonb('def').$type<EnumDef>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  table => [
    uniqueIndex('data_model_enums_model_name_namespace_idx').on(
      table.dataModelId,
      table.name,
      table.namespace,
    ),
    index('data_model_enums_model_idx').on(table.dataModelId),
    index('data_model_enums_namespace_idx').on(table.namespace),
  ],
);

export const dataModelRelations = pgTable(
  'data_model_relations',
  {
    id: uuidV7('id').primaryKey(),
    dataModelId: uuidV7('dataModelId')
      .notNull()
      .references(() => dataModels.id, { onDelete: 'cascade' }),
    relationId: text('relationId').notNull(),

    def: jsonb('def').$type<RelationDef<EntityDef, EntityDef>>().notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  table => [
    uniqueIndex('data_model_relations_model_relation_id_idx').on(
      table.dataModelId,
      table.relationId,
    ),
    index('data_model_relations_model_idx').on(table.dataModelId),
  ],
);
