import { ParsedUrlQueryInput } from 'node:querystring';

export type GoogleCommonAccessTokenRefreshRequestData = ParsedUrlQueryInput & {
  client_id: string;
  client_secret: string;
  grant_type: 'refresh_token';
  refresh_token: string;
};
