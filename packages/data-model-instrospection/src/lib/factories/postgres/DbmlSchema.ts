/**
 * DBML Schema Types
 *
 * These types represent the output format from @dbml/connector
 * and are specific to the PostgreSQL introspection implementation.
 */

export interface DbmlTable {
  name: string;
  schemaName: string;
  note: { value: string };
}

export interface DbmlField {
  name: string;
  type: { type_name: string; schemaName: string | null };
  dbdefault:
    | { type: 'expression'; value: string }
    | { type: 'string'; value: string }
    | { type: 'boolean'; value: string }
    | null;
  not_null: boolean;
  increment: boolean;
  note: { value: string };
}

export interface DbmlRefEndpoint {
  tableName: string;
  schemaName: string;
  fieldNames: string[];
  relation: '*' | '1';
}

export interface DbmlRef {
  name: string;
  endpoints: [DbmlRefEndpoint, DbmlRefEndpoint];
  onDelete: string | null;
  onUpdate: string | null;
}

export interface DbmlEnum {
  name: string;
  schemaName: string;
  values: Array<{ name: string }>;
}

export interface DbmlIndex {
  name: string;
  type: string;
  columns: Array<{ type: 'column'; value: string }>;
}

export interface DbmlConstraint {
  pk?: true;
  unique?: true;
}

export interface DbmlSchema {
  tables: DbmlTable[];
  fields: Record<string, DbmlField[]>;
  refs: DbmlRef[];
  enums: DbmlEnum[];
  indexes: Record<string, DbmlIndex[]>;
  tableConstraints: Record<string, Record<string, DbmlConstraint>>;
}
