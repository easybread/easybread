import type { DataModelDef } from '../data-model';

/**
 * Generic schema transformer interface
 * TInput is the schema format it expects
 * TOutput is what it produces (usually DataModelDef)
 */

export interface SchemaTransformer<TInput, TOutput = DataModelDef> {
  transform(schema: TInput, modelName: string): TOutput;
}
