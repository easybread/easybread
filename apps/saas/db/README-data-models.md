# Data Model Storage Schema

This document describes the simplified Drizzle schema designed to store `DataModel` definitions from the `@easybread/data-model` package in the SaaS application database using JSONB columns.

## Overview

The data model storage schema provides a clean meta-schema solution that stores introspected database schemas from PostgreSQL (via `PostgresFactory`) or manually created data models. This enables:

- **Schema Versioning**: Track changes to data models over time
- **Multi-tenancy**: Store different models per organization  
- **Source Tracking**: Link models to their original database connections
- **Analysis & Code Generation**: Query stored models for insights and automation
- **Simplified Storage**: Full definition objects stored as JSONB for easy retrieval

## Schema Structure

### Core Tables (4 tables total)

#### `data_models`
Main table storing data model metadata and the complete definition:
- `id` - Primary key (UUID v7)
- `organizationId` - Links to organization (cascade delete)
- `name` - Model name (unique per org)
- `description` - Optional description
- `sourceType` - Source type (e.g., 'postgres', 'mysql', 'manual')
- `sourceConnectionId` - Optional link to connection record
- `version` - Version number (default: 1)
- `isActive` - Active flag (default: true)
- **`def`** - **Complete `DataModelDef` stored as JSONB**
- Timestamps: `createdAt`, `updatedAt`

#### `data_model_entities`
Stores entity (table) definitions with JSONB:
- `id` - Primary key (UUID v7)
- `dataModelId` - References data_models (cascade delete)
- `name` - Entity name (for indexing/querying)
- `namespace` - Optional namespace (for indexing/querying)
- **`def`** - **Complete `EntityDef` stored as JSONB**
- `createdAt` timestamp

#### `data_model_enums`
Stores enum definitions with JSONB:
- `id` - Primary key (UUID v7)
- `dataModelId` - References data_models (cascade delete)
- `name` - Enum name (for indexing/querying)
- `namespace` - Optional namespace (for indexing/querying)
- **`def`** - **Complete `EnumDef` stored as JSONB**
- `createdAt` timestamp

#### `data_model_relations`
Stores relationship definitions with JSONB:
- `id` - Primary key (UUID v7)
- `dataModelId` - References data_models (cascade delete)
- `relationId` - Business identifier
- `fromEntityName`, `fromEntityNamespace` - Source entity info (for indexing)
- `toEntityName`, `toEntityNamespace` - Target entity info (for indexing)
- **`def`** - **Complete `RelationDef` stored as JSONB**
- `createdAt` timestamp

### Key Benefits of JSONB Approach

1. **Simplified Schema**: Only 4 tables instead of 7+
2. **Complete Fidelity**: Full definition objects always available
3. **Easy Evolution**: Schema changes don't require migrations
4. **Performance**: JSONB provides excellent querying with GIN indexes
5. **Developer Experience**: Work directly with typed objects
6. **Reduced Complexity**: No complex joins to reconstruct objects

## Usage Examples

### 1. Introspect and Store a PostgreSQL Database

```typescript
import { introspectPostgres } from '@easybread/data-model';
import { storeDataModel, saasdb } from '@easybread/saas-db';

async function introspectAndStore(organizationId: string, connectionString: string) {
  // 1. Introspect the database
  const dataModel = await introspectPostgres({
    connectionString: 'postgresql://user:pass@localhost:5432/mydb',
    databaseName: 'my_model', // Optional override
  });

  // 2. Store in SaaS database (complete object in JSONB)
  const modelId = await storeDataModel(saasdb, {
    organizationId,
    model: dataModel,
    sourceType: 'postgres',
    sourceConnectionId: 'connection-uuid',
    description: 'Production database schema',
  });

  return modelId;
}
```

### 2. Retrieve a Complete Stored Model

```typescript
import { getDataModel } from '@easybread/saas-db';

async function getStoredModel(organizationId: string, modelName: string) {
  const result = await getDataModel(saasdb, organizationId, modelName);
  
  if (!result) {
    throw new Error('Model not found');
  }

  // Access the complete DataModel (stored in JSONB)
  const { model } = result;
  console.log(`Found ${model.entities.length} entities`);
  console.log(`Found ${model.relations.length} relations`);
  
  return result;
}
```

### 3. Query Individual Components

```typescript
import { 
  getDataModelEntities, 
  getDataModelEnums, 
  getDataModelRelations 
} from '@easybread/saas-db';

async function queryComponents(dataModelId: string) {
  // Get entities with their complete definitions
  const entities = await getDataModelEntities(saasdb, dataModelId);
  for (const entity of entities) {
    console.log(`Entity: ${entity.name}`);
    console.log(`Fields: ${Object.keys(entity.def.fields).length}`);
  }

  // Get enums with their complete definitions
  const enums = await getDataModelEnums(saasdb, dataModelId);
  for (const enumDef of enums) {
    console.log(`Enum: ${enumDef.name} = [${enumDef.def.values.join(', ')}]`);
  }

  // Get relations with their complete definitions
  const relations = await getDataModelRelations(saasdb, dataModelId);
  for (const relation of relations) {
    console.log(`${relation.fromEntityName} -> ${relation.toEntityName}`);
  }
}
```

### 4. Update a Model (Creates New Version)

```typescript
import { updateDataModel } from '@easybread/saas-db';

async function updateModel(organizationId: string, modelName: string) {
  // Introspect updated database
  const updatedModel = await introspectPostgres({
    connectionString: 'postgresql://user:pass@localhost:5432/mydb_v2',
  });

  // Create new version (deactivates old version)
  const newModelId = await updateDataModel(
    saasdb,
    organizationId,
    modelName,
    updatedModel,
    'Updated for new requirements',
  );

  return newModelId;
}
```

## Key Features

### 1. Complete Fidelity with Simplicity
- Full `DataModelDef` objects stored as JSONB
- No data loss or transformation required
- Simple retrieval with full type safety

### 2. Performance Optimized
- Strategic indexes on key fields (name, namespace, entity names)
- JSONB enables efficient querying of definition contents
- Composite unique constraints prevent duplicates

### 3. Easy Maintenance
- Only 4 tables to manage
- Schema evolution through JSONB flexibility
- Clear separation between metadata and definitions

### 4. Analysis Friendly
- Query individual components when needed
- Full definitions always available for complex analysis
- Efficient filtering by entity names, namespaces, etc.

## Integration with PostgresFactory

The schema works seamlessly with the `PostgresFactory`:

```typescript
import { IntrospectionFactoryPostgres } from '@easybread/data-model';

// Create strategy and introspect
const strategy = IntrospectionFactoryPostgres.create({
  connectionString: 'postgresql://...',
});

const dataModel = await strategy.introspect();

// Store result in SaaS database (complete object stored as JSONB)
await storeDataModel(saasdb, {
  organizationId: 'org-123',
  model: dataModel,
  sourceType: 'postgres',
});
```

## JSONB Querying Capabilities

With JSONB storage, you can perform advanced queries:

```sql
-- Find all entities with specific field types
SELECT name, def FROM data_model_entities 
WHERE def->'fields' ? 'id' 
AND def->'fields'->'id'->>'type' = 'UUID';

-- Find all relations with CASCADE delete
SELECT * FROM data_model_relations 
WHERE def->>'onDelete' = 'CASCADE';

-- Search enum values
SELECT name, def FROM data_model_enums 
WHERE def->'values' @> '["ACTIVE"]';
```

## Database Migrations

The simplified schema follows Drizzle best practices:
- Uses `uuidV7` for primary keys
- Follows naming conventions
- Proper cascade delete relationships
- JSONB columns with TypeScript type safety

To apply the schema:

```bash
# Generate migration
pnpm nx run saas-db:db:generate

# Apply migration  
pnpm nx run saas-db:db:migrate
```

## Performance Considerations

- JSONB provides excellent read performance for complete objects
- Indexes on extracted key fields enable efficient filtering
- GIN indexes can be added to JSONB columns if needed for complex queries
- Version management keeps historical data while maintaining active model performance

## Future Enhancements

The JSONB approach enables easy extensions:
- Add GIN indexes for complex JSONB queries
- Schema validation at application level
- Model comparison and diffing utilities
- GraphQL integration for definition querying
- Real-time model change notifications 