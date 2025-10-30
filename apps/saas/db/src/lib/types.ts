import type {
  dataModelEntities,
  dataModelEnums,
  dataModelRelations,
  dataModels,
} from './schema/dataModel';
import { connections, users } from './schema/schema';

export type PgUserSelect = typeof users.$inferSelect;

export type PgConnectionSelect = typeof connections.$inferSelect;
export type PgConnectionInsert = typeof connections.$inferInsert;

export type {
  ConnectionSettingsJsonb,
  ConnectionSettingsJsonb_DbMongo,
  ConnectionSettingsJsonb_DbMySql,
  ConnectionSettingsJsonb_DbPg,
  ConnectionSettingsJsonb_EbBamboo,
  ConnectionSettingsJsonb_EbBreezy,
  ConnectionSettingsJsonb_EbGoogleAD,
  ConnectionSettingsJsonb_EbGoogleContacts,
} from './jsonb/ConnectionSettingsJsonb';

export type DataModelEntityInsert = typeof dataModelEntities.$inferInsert;
export type DataModelEnumInsert = typeof dataModelEnums.$inferInsert;
export type DataModelRelationInsert = typeof dataModelRelations.$inferInsert;

export type DataModelSelect = typeof dataModels.$inferSelect;
export type DataModelEntitySelect = typeof dataModelEntities.$inferSelect;
export type DataModelEnumSelect = typeof dataModelEnums.$inferSelect;
export type DataModelRelationSelect = typeof dataModelRelations.$inferSelect;
