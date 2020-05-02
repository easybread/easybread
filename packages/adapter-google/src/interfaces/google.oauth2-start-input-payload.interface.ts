/**
 * See {@link https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient}
 */
export interface GoogleOauth2StartInputPayload {
  scope: string[];
  state?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
  prompt?: 'none' | ('consent' | 'select_account')[];
}
