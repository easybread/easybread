import type { AuthAnySchema } from './auth/auth-any.schema';
import type { CommonAnySchema } from './common/common-any.schema';
import type { HrAnySchema } from './hr/hr-any.schema';

export type AnySchema = CommonAnySchema | HrAnySchema | AuthAnySchema;
