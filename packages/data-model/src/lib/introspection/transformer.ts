import {
  type DataModelDef,
  type EntityDef,
  type EnumDef,
  FIELD_TYPE,
  NUMBER_ID_ALGORITHM,
  RELATION_ACTION,
  RELATION_MULTIPLICITY,
  type RelationDef,
  UUID_ALGORITHM,
  type ValueDef,
} from '../data-model.js';

import type { DbmlEnum, DbmlField, DbmlRef, DbmlSchema } from './dbml-types.js';
import { type SchemaTransformer, TransformationError } from './types.js';

// Constants to avoid magic strings
const DRIZZLE_SCHEMA = 'drizzle';
const PUBLIC_SCHEMA = 'public';

export class DbmlToDataModelTransformer
  implements SchemaTransformer<DbmlSchema>
{
  transform(dbmlSchema: DbmlSchema, modelName: string): DataModelDef {
    try {
      const namespaces = this.extractNamespaces(dbmlSchema);
      const enums = this.transformEnums(dbmlSchema.enums);
      const entities = this.transformEntities(dbmlSchema, enums);
      const relations = this.transformRelations(dbmlSchema.refs, entities);

      return {
        name: modelName,
        entities,
        relations,
        enums,
        namespaces,
      };
    } catch (error) {
      throw new TransformationError('Failed to transform DBML schema', {
        cause: error,
      });
    }
  }

  private extractNamespaces(dbmlSchema: DbmlSchema): string[] {
    const namespaces = new Set<string>();

    // Single iteration combining table and enum processing for better performance
    const processNamespace = (schemaName: string) => {
      if (schemaName && schemaName !== PUBLIC_SCHEMA) {
        namespaces.add(schemaName);
      }
    };

    dbmlSchema.tables.forEach(table => processNamespace(table.schemaName));
    dbmlSchema.enums.forEach(enumDef => processNamespace(enumDef.schemaName));

    return Array.from(namespaces).sort();
  }

  private transformEnums(dbmlEnums: DbmlEnum[]): EnumDef[] {
    return dbmlEnums.map(enumDef => ({
      name: enumDef.name,
      namespace:
        enumDef.schemaName === PUBLIC_SCHEMA ? undefined : enumDef.schemaName,
      values: enumDef.values.map(v => v.name) as readonly string[],
    }));
  }

  private transformEntities(
    dbmlSchema: DbmlSchema,
    enums: EnumDef[],
  ): EntityDef[] {
    const entities: EntityDef[] = [];

    for (const table of dbmlSchema.tables) {
      // Skip migration tables
      if (table.schemaName === DRIZZLE_SCHEMA) continue;

      const tableKey = `${table.schemaName}.${table.name}`;
      const fields = dbmlSchema.fields[tableKey] || [];
      const constraints = dbmlSchema.tableConstraints[tableKey] || {};

      const entityFields: Record<string, ValueDef> = {};

      for (const field of fields) {
        const fieldConstraint = constraints[field.name];
        const valueDef = this.transformField(field, fieldConstraint, enums);
        entityFields[field.name] = valueDef;
      }

      entities.push({
        name: table.name,
        namespace:
          table.schemaName === PUBLIC_SCHEMA ? undefined : table.schemaName,
        fields: entityFields,
      });
    }

    return entities;
  }

  private transformField(
    field: DbmlField,
    constraint: { pk?: true; unique?: true } | undefined,
    enums: EnumDef[],
  ): ValueDef {
    const baseProps = {
      nullable: !field.not_null,
      unique: constraint?.unique === true,
      pk: constraint?.pk === true,
      defaultValue: this.extractDefaultValue(field),
    };

    // Handle enum types
    const enumDef = enums.find(
      e =>
        e.name === field.type.type_name ||
        `${e.namespace || PUBLIC_SCHEMA}.${e.name}` === field.type.type_name,
    );

    if (enumDef) {
      return {
        type: FIELD_TYPE.enum.ENUM,
        enumName: enumDef.name,
        namespace: enumDef.namespace,
        ...baseProps,
      };
    }

    // Handle UUID types
    if (field.type.type_name === 'uuid') {
      return {
        type: FIELD_TYPE.enum.UUID,
        algorithm: UUID_ALGORITHM.enum.UUID_V7, // Default assumption
        ...baseProps,
      };
    }

    // Handle auto-increment number IDs
    if (
      field.increment &&
      (field.type.type_name === 'int4' || field.type.type_name === 'int8')
    ) {
      return {
        type: FIELD_TYPE.enum.NUMBER_ID,
        algorithm: NUMBER_ID_ALGORITHM.enum.INCREMENT,
        ...baseProps,
      };
    }

    // Handle other numeric types
    if (this.isNumericType(field.type.type_name)) {
      return {
        type: FIELD_TYPE.enum.NUMBER,
        ...baseProps,
      };
    }

    // Handle boolean
    if (field.type.type_name === 'bool') {
      return {
        type: FIELD_TYPE.enum.BOOLEAN,
        ...baseProps,
      };
    }

    // Handle date/time types
    if (this.isDateTimeType(field.type.type_name)) {
      return {
        type: FIELD_TYPE.enum.DATE,
        ...baseProps,
      };
    }

    // Default to string for text types and others
    return {
      type: FIELD_TYPE.enum.STRING,
      ...baseProps,
    };
  }

  private isNumericType(typeName: string): boolean {
    return [
      'int2',
      'int4',
      'int8',
      'float4',
      'float8',
      'numeric',
      'decimal',
    ].includes(typeName);
  }

  private isDateTimeType(typeName: string): boolean {
    return ['timestamp', 'timestamptz', 'date', 'time', 'timetz'].includes(
      typeName,
    );
  }

  private extractDefaultValue(field: DbmlField): unknown {
    if (!field.dbdefault) return undefined;

    switch (field.dbdefault.type) {
      case 'string':
        return field.dbdefault.value;
      case 'boolean':
        return field.dbdefault.value === 'true';
      case 'expression':
        // For expressions like now(), we don't set a default value in the model
        return undefined;
      default:
        return undefined;
    }
  }

  private transformRelations(
    dbmlRefs: DbmlRef[],
    entities: EntityDef[],
  ): RelationDef<EntityDef, EntityDef>[] {
    const relations: RelationDef<EntityDef, EntityDef>[] = [];

    for (const ref of dbmlRefs) {
      const [fromEndpoint, toEndpoint] = ref.endpoints;

      const fromEntity = entities.find(
        e =>
          e.name === fromEndpoint.tableName &&
          (e.namespace || PUBLIC_SCHEMA) === fromEndpoint.schemaName,
      );

      const toEntity = entities.find(
        e =>
          e.name === toEndpoint.tableName &&
          (e.namespace || PUBLIC_SCHEMA) === toEndpoint.schemaName,
      );

      if (!fromEntity || !toEntity) continue;

      relations.push({
        id: ref.name,
        from: {
          entity: fromEntity.name,
          namespace: fromEntity.namespace,
          fieldNames: fromEndpoint.fieldNames,
          mul:
            fromEndpoint.relation === '*'
              ? RELATION_MULTIPLICITY.enum.MANY
              : RELATION_MULTIPLICITY.enum.ONE,
        },
        to: {
          entity: toEntity.name,
          namespace: toEntity.namespace,
          fieldNames: toEndpoint.fieldNames,
          mul:
            toEndpoint.relation === '*'
              ? RELATION_MULTIPLICITY.enum.MANY
              : RELATION_MULTIPLICITY.enum.ONE,
        },
        onDelete: this.mapRelationAction(ref.onDelete),
        onUpdate: this.mapRelationAction(ref.onUpdate),
      });
    }

    return relations;
  }

  private mapRelationAction(
    action: string | null,
  ): typeof RELATION_ACTION.$type | null {
    if (!action) return null;

    const actionMap: Record<string, typeof RELATION_ACTION.$type> = {
      'SET NULL': RELATION_ACTION.enum['SET NULL'],
      SET_DEFAULT: RELATION_ACTION.enum.SET_DEFAULT,
      CASCADE: RELATION_ACTION.enum.CASCADE,
      'NO ACTION': RELATION_ACTION.enum['NO ACTION'],
      RESTRICT: RELATION_ACTION.enum.RESTRICT,
    };

    return actionMap[action] || null;
  }
}
