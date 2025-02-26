/**
 * See {@link https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient}
 */
export interface GoogleCommonOauth2StartOperationInputPayload<
  TScopes extends string,
> {
  scope: TScopes[];
  includeGrantedScopes?: boolean;
  loginHint?: string;
  prompt?: 'none' | ('consent' | 'select_account')[];
}
