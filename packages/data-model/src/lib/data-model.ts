import { enumObject, enumSuiteObject } from '@space-architects/util-enum';
import type { PropValues } from '@space-architects/util-ts';

export const FIELD_TYPE = enumSuiteObject(
  enumObject([
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'DATE',
    'ENUM',
    'UUID',
    'NUMBER_ID',
  ]),
);

export const RELATION_ACTION = enumSuiteObject(
  enumObject(['SET_NULL', 'SET_DEFAULT', 'CASCADE', 'NO_ACTION', 'RESTRICT']),
);

export const UUID_ALGORITHM = enumSuiteObject(
  enumObject(['UUID_V4', 'UUID_V7', 'CUID', 'CUID_V2']),
);

export const NUMBER_ID_ALGORITHM = enumSuiteObject(enumObject(['INCREMENT']));

export const RELATION_MULTIPLICITY = enumSuiteObject(
  enumObject(['ONE', 'MANY']),
);

export type FieldValueMap = {
  [FIELD_TYPE.enum.STRING]: string;
  [FIELD_TYPE.enum.NUMBER]: number;
  [FIELD_TYPE.enum.BOOLEAN]: boolean;
  [FIELD_TYPE.enum.DATE]: string;
  [FIELD_TYPE.enum.ENUM]: Enum[number];
  [FIELD_TYPE.enum.NUMBER_ID]: number;
  [FIELD_TYPE.enum.UUID]: string;
};

export type Enum = readonly string[];

export type EnumDef = {
  name: string;
  namespace?: string;
  values: Enum;
};

export interface FieldDefBase<TTypeName extends typeof FIELD_TYPE.$type> {
  type: TTypeName;
  defaultValue?: FieldValueMap[TTypeName];
  nullable?: boolean;
  unique?: boolean;
  pk?: boolean;
}

export type FieldDefExtended<
  TTypeName extends typeof FIELD_TYPE.$type,
  T extends Record<string, unknown>,
> = FieldDefBase<TTypeName> & T;

export type FieldDefMap = {
  [FIELD_TYPE.enum.STRING]: FieldDefBase<typeof FIELD_TYPE.enum.STRING>;
  [FIELD_TYPE.enum.NUMBER]: FieldDefBase<typeof FIELD_TYPE.enum.NUMBER>;
  [FIELD_TYPE.enum.BOOLEAN]: FieldDefBase<typeof FIELD_TYPE.enum.BOOLEAN>;
  [FIELD_TYPE.enum.DATE]: FieldDefBase<typeof FIELD_TYPE.enum.DATE>;
  [FIELD_TYPE.enum.ENUM]: FieldDefExtended<
    typeof FIELD_TYPE.enum.ENUM,
    { enumName: string; namespace?: string }
  >;
  [FIELD_TYPE.enum.NUMBER_ID]: FieldDefExtended<
    typeof FIELD_TYPE.enum.NUMBER_ID,
    { algorithm: typeof NUMBER_ID_ALGORITHM.$type }
  >;
  [FIELD_TYPE.enum.UUID]: FieldDefExtended<
    typeof FIELD_TYPE.enum.UUID,
    { algorithm: typeof UUID_ALGORITHM.$type; increment?: number }
  >;
};

export type ValueDef = PropValues<FieldDefMap>;

export interface EntityDef {
  name: string;
  namespace?: string;
  fields: Record<string, ValueDef>;
}

export interface RelationEndpoint<T extends EntityDef> {
  entity: T['name'];
  namespace: T['namespace'];
  fieldNames: (keyof T['fields'])[];
  mul: typeof RELATION_MULTIPLICITY.$type;
}

export interface RelationDef<From extends EntityDef, To extends EntityDef> {
  id: string;
  from: RelationEndpoint<From>;
  to: RelationEndpoint<To>;
  onDelete: typeof RELATION_ACTION.$type | null;
  onUpdate: typeof RELATION_ACTION.$type | null;
}

export interface DataModelDef {
  name: string;
  entities: EntityDef[];
  relations: RelationDef<EntityDef, EntityDef>[];
  enums: EnumDef[];
  namespaces: string[];
}
