/**
 * See {@link https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code}
 */
export interface GoogleOauth2CompleteInputPayload {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}
