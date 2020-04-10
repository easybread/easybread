import { ParsedUrlQueryInput } from 'querystring';

export interface GoogleAuthorizationParameters extends ParsedUrlQueryInput {
  access_type: string;
  scope: string;
  response_type: string;
  redirect_uri: string;
  state?: string;
  client_id: string;
  include_granted_scopes: boolean;
  login_hint?: string;
  prompt?: 'none' | ('consent' | 'select_account')[];
  alt: 'json';
}
