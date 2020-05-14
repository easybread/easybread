export interface GoogleCommonAccessTokenRefreshResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
}
