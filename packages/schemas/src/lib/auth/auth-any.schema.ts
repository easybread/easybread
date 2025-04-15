import type { AuthCompleteOauth2RequestSchema } from './auth-complete-oauth2-request.schema';
import type { AuthCompleteOauth2ResponseSchema } from './auth-complete-oauth2-response.schema';
import type { AuthCompleteOidcRequestSchema } from './auth-complete-oidc-request.schema';
import type { AuthCompleteOidcResponseSchema } from './auth-complete-oidc-response.schema';
import type { AuthCredentialApiKeySchema } from './auth-credential-api-key.schema';
import type { AuthCredentialBasicSchema } from './auth-credential-basic.schema';
import type { AuthCredentialOauth2Schema } from './auth-credential-oauth2.schema';
import type { AuthCredentialOidcSchema } from './auth-credential-oidc.schema';
import type { AuthStartOauth2RequestSchema } from './auth-start-oauth2-request.schema';
import type { AuthStartOauth2ResponseSchema } from './auth-start-oauth2-response.schema';
import type { AuthStartOidcRequestSchema } from './auth-start-oidc-request.schema';
import type { AuthStartOidcResponseSchema } from './auth-start-oidc-response.schema';

export type AuthAnySchema =
  | AuthCompleteOauth2RequestSchema
  | AuthCompleteOauth2ResponseSchema
  | AuthCompleteOidcRequestSchema
  | AuthCompleteOidcResponseSchema
  | AuthCredentialApiKeySchema
  | AuthCredentialBasicSchema
  | AuthCredentialOauth2Schema
  | AuthCredentialOidcSchema
  | AuthStartOauth2RequestSchema
  | AuthStartOauth2ResponseSchema
  | AuthStartOidcRequestSchema
  | AuthStartOidcResponseSchema;
