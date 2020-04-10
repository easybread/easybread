/**
 * See {@link https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code}
 */
export interface GoogleOauth2RefreshInputPayload {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}
