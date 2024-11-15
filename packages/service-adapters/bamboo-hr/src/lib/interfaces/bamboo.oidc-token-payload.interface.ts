export type BambooOidcTokenPayload = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
  company_domain: string;
};
