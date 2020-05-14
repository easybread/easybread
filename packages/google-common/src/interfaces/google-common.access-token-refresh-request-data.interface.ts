import { ParsedUrlQueryInput } from 'querystring';

export interface GoogleCommonAccessTokenRefreshRequestData
  extends ParsedUrlQueryInput {
  client_id: string;
  client_secret: string;
  grant_type: 'refresh_token';
  refresh_token: string;
}
