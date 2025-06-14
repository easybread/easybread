import { customType } from 'drizzle-orm/pg-core';
import { v7 } from 'uuid';

/**
 * A custom type for UUIDv7 columns. Not null
 */
export const uuidV7 = (name: string) =>
  customType<{ data: string; notNull: true; default: true }>({
    dataType: () => 'uuid',
  })(name)
    .notNull()
    .$defaultFn(() => v7());

/**
 * A custom type for UUIDv7 columns. Nullable
 */
export const uuidV7Nullable = (name: string) =>
  customType<{ data: string; notNull: false; default: false }>({
    dataType: () => 'uuid',
  })(name);
