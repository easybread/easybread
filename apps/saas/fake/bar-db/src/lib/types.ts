import * as schema from './schema/schema';

export type PgApplicationSelect = typeof schema.applications.$inferSelect;
export type PgApplicationInsert = typeof schema.applications.$inferInsert;
