import { ParsedUrlQueryInput } from 'node:querystring';

export type GoogleCommonAccessTokenCreateRequestData = ParsedUrlQueryInput & {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code';
  redirect_uri: string;
};
