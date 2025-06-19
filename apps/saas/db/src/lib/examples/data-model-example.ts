import { introspectPostgres } from '@easybread/data-model';

import {
  deleteDataModel,
  getDataModel,
  getDataModelEntities,
  getDataModelEnums,
  getDataModelRelations,
  listDataModels,
  storeDataModel,
  updateDataModel,
} from '../data-model-storage';
import { saasdb } from '../saasdb';

/**
 * Example: Introspect a PostgreSQL database and store the model
 */
export async function introspectAndStoreModel(
  organizationId: string,
  connectionId: string,
  connectionString: string,
  modelName?: string,
): Promise<string> {
  // 1. Introspect the database using PostgresFactory
  const dataModel = await introspectPostgres({
    connectionString,
    databaseName: modelName, // Optional: override extracted database name
  });

  // 2. Store the model in our saas database
  const dataModelId = await storeDataModel(saasdb, {
    organizationId,
    model: dataModel,
    sourceType: 'postgres',
    sourceConnectionId: connectionId,
    description: `PostgreSQL database model for ${dataModel.name}`,
  });

  console.log(`Stored data model with ID: ${dataModelId}`);
  return dataModelId;
}

/**
 * Example: Retrieve and reconstruct a stored data model
 */
export async function retrieveStoredModel(
  organizationId: string,
  modelName: string,
) {
  const storedModel = await getDataModel(saasdb, organizationId, modelName);

  if (!storedModel) {
    throw new Error(`Data model '${modelName}' not found`);
  }

  console.log('Retrieved data model:', {
    id: storedModel.id,
    name: storedModel.name,
    description: storedModel.description,
    sourceType: storedModel.sourceType,
    entitiesCount: storedModel.model.entities.length,
    relationsCount: storedModel.model.relations.length,
    enumsCount: storedModel.model.enums.length,
    namespaces: storedModel.model.namespaces,
  });

  return storedModel;
}

/**
 * Example: List all data models for an organization
 */
export async function listOrganizationModels(organizationId: string) {
  const models = await listDataModels(saasdb, organizationId);

  console.log(`Found ${models.length} data models:`);
  for (const model of models) {
    console.log(
      `- ${model.name} (${model.sourceType || 'manual'}) - v${model.version} - ${model.description || 'No description'}`,
    );
  }

  return models;
}

/**
 * Example: Query individual components of a stored model
 */
export async function queryModelComponents(
  organizationId: string,
  modelName: string,
) {
  const storedModel = await getDataModel(saasdb, organizationId, modelName);

  if (!storedModel) {
    throw new Error(`Model ${modelName} not found`);
  }

  const dataModelId = storedModel.id;

  // Get entities separately (useful for analysis)
  const entities = await getDataModelEntities(saasdb, dataModelId);
  console.log(`Found ${entities.length} entities:`);
  for (const entity of entities) {
    const fieldCount = Object.keys(entity.def.fields).length;
    console.log(
      `- ${entity.namespace ? entity.namespace + '.' : ''}${entity.name} (${fieldCount} fields)`,
    );
  }

  // Get enums separately
  const enums = await getDataModelEnums(saasdb, dataModelId);
  console.log(`\nFound ${enums.length} enums:`);
  for (const enumDef of enums) {
    console.log(
      `- ${enumDef.namespace ? enumDef.namespace + '.' : ''}${enumDef.name}: [${enumDef.def.values.join(', ')}]`,
    );
  }

  // Get relations separately
  const relations = await getDataModelRelations(saasdb, dataModelId);
  console.log(`\nFound ${relations.length} relations:`);
  for (const relation of relations) {
    console.log(
      `- ${relation.fromEntityName} -> ${relation.toEntityName} (${relation.def.onDelete || 'NO ACTION'})`,
    );
  }

  return { entities, enums, relations };
}

/**
 * Example: Update an existing data model (creates new version)
 */
export async function updateExistingModel(
  organizationId: string,
  modelName: string,
  newConnectionString: string,
) {
  // 1. Introspect the updated database
  const updatedDataModel = await introspectPostgres({
    connectionString: newConnectionString,
    databaseName: modelName,
  });

  // 2. Update the model (creates new version, deactivates old)
  const newModelId = await updateDataModel(
    saasdb,
    organizationId,
    modelName,
    updatedDataModel,
    `Updated schema for ${modelName}`,
  );

  console.log(
    `Created new version of model ${modelName} with ID: ${newModelId}`,
  );
  return newModelId;
}

/**
 * Example: Complete workflow - from database connection to stored model
 */
export async function completeDataModelWorkflow() {
  const organizationId = 'example-org-id';
  const connectionId = 'example-connection-id';

  // Example PostgreSQL connection string
  const connectionString =
    'postgresql://user:password@localhost:5432/my_database';

  try {
    // 1. Introspect and store the model
    const modelId = await introspectAndStoreModel(
      organizationId,
      connectionId,
      connectionString,
      'my_custom_model_name', // Optional: override the database name
    );

    // 2. Retrieve the stored model
    const storedModel = await retrieveStoredModel(
      organizationId,
      'my_custom_model_name',
    );

    // 3. Display model structure (using the JSONB-stored definition)
    console.log('\n=== Data Model Structure ===');
    console.log(`Name: ${storedModel.model.name}`);
    console.log(`Namespaces: ${storedModel.model.namespaces.join(', ')}`);

    console.log('\n--- Entities ---');
    for (const entity of storedModel.model.entities) {
      const fieldCount = Object.keys(entity.fields).length;
      console.log(
        `${entity.namespace ? entity.namespace + '.' : ''}${entity.name} (${fieldCount} fields)`,
      );

      // Show primary key fields
      const pkFields = Object.entries(entity.fields)
        .filter(([, field]) => field.pk)
        .map(([name]) => name);

      if (pkFields.length > 0) {
        console.log(`  PK: ${pkFields.join(', ')}`);
      }
    }

    console.log('\n--- Relations ---');
    for (const relation of storedModel.model.relations) {
      console.log(
        `${relation.from.entity} -> ${relation.to.entity} (${relation.onDelete || 'NO ACTION'})`,
      );
    }

    console.log('\n--- Enums ---');
    for (const enumDef of storedModel.model.enums) {
      console.log(
        `${enumDef.namespace ? enumDef.namespace + '.' : ''}${enumDef.name}: [${enumDef.values.join(', ')}]`,
      );
    }

    // 4. Query individual components
    console.log('\n=== Querying Individual Components ===');
    await queryModelComponents(organizationId, 'my_custom_model_name');

    // 5. List all models for the organization
    await listOrganizationModels(organizationId);

    return storedModel;
  } catch (error) {
    console.error('Error in data model workflow:', error);
    throw error;
  }
}

/**
 * Example: Using the stored model for code generation or analysis
 */
export async function analyzeStoredModel(
  organizationId: string,
  modelName: string,
) {
  const storedModel = await getDataModel(saasdb, organizationId, modelName);

  if (!storedModel) {
    throw new Error(`Model ${modelName} not found`);
  }

  const { model } = storedModel;

  // Example analysis: Find all UUID fields
  const uuidFields: Array<{
    entity: string;
    field: string;
    namespace?: string;
  }> = [];

  for (const entity of model.entities) {
    for (const [fieldName, fieldDef] of Object.entries(entity.fields)) {
      if (fieldDef.type === 'UUID') {
        uuidFields.push({
          entity: entity.name,
          field: fieldName,
          namespace: entity.namespace,
        });
      }
    }
  }

  console.log(`Found ${uuidFields.length} UUID fields:`, uuidFields);

  // Example analysis: Find all foreign key relations
  const foreignKeys = model.relations.map(rel => ({
    from: `${rel.from.entity}.${rel.from.fieldNames.join(',')}`,
    to: `${rel.to.entity}.${rel.to.fieldNames.join(',')}`,
    onDelete: rel.onDelete,
  }));

  console.log(
    `Found ${foreignKeys.length} foreign key relations:`,
    foreignKeys,
  );

  // Example analysis: Find entities without primary keys
  const entitiesWithoutPK = model.entities.filter(
    entity => !Object.values(entity.fields).some(field => field.pk),
  );

  if (entitiesWithoutPK.length > 0) {
    console.warn(
      'Entities without primary keys:',
      entitiesWithoutPK.map(e => e.name),
    );
  }

  return {
    uuidFields,
    foreignKeys,
    entitiesWithoutPK,
    totalEntities: model.entities.length,
    totalRelations: model.relations.length,
    totalEnums: model.enums.length,
  };
}

/**
 * Example: Manage model lifecycle
 */
export async function manageModelLifecycle(organizationId: string) {
  const modelName = 'test_model';

  try {
    // Create initial model
    console.log('Creating initial model...');
    const modelId1 = await introspectAndStoreModel(
      organizationId,
      'connection-1',
      'postgresql://localhost:5432/test_db_v1',
      modelName,
    );

    // Update model (new version)
    console.log('Updating model...');
    const modelId2 = await updateExistingModel(
      organizationId,
      modelName,
      'postgresql://localhost:5432/test_db_v2',
    );

    // List all versions
    console.log('All models:');
    await listOrganizationModels(organizationId);

    // Delete model (removes all versions)
    console.log('Deleting model...');
    const deleted = await deleteDataModel(saasdb, organizationId, modelName);
    console.log(`Model deleted: ${deleted}`);
  } catch (error) {
    console.error('Error in model lifecycle:', error);
  }
}
