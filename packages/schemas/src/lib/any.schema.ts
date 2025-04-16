import type { AuthAnySchema } from './auth/auth-any.schema';
import type { CommonAnySchema } from './common/common-any.schema';
import type { HrAnySchema } from './hr/hr-any.schema';
import type { CompositeSchema } from './util/composite.schema';

/**
 * @private
 * Private type to avoid recursive types
 */
export type _AnySchema = CommonAnySchema | HrAnySchema | AuthAnySchema;

export type AnySchema = _AnySchema | CompositeSchema<_AnySchema[]>;
