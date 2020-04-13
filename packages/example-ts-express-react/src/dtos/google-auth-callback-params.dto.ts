import { ParsedUrlQuery } from 'querystring';

export interface GoogleAuthCallbackParamsDto extends ParsedUrlQuery {
  code: string;
  scope: string;
}
