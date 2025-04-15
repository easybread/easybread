export const AUTH_BASE_SCHEMA_CONTEXT =
  'https://schema.easybread.io/auth' as const;

export type AuthBaseSchemaContext = typeof AUTH_BASE_SCHEMA_CONTEXT;

export type AuthBaseSchema = {
  '@context': AuthBaseSchemaContext;
};
