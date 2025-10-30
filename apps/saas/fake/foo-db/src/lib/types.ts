import * as schema from './schema/schema';

export type PgAddressSelect = typeof schema.addresses.$inferSelect;
export type PgAddressInsert = typeof schema.addresses.$inferInsert;
