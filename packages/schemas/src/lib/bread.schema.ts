export interface BreadSchema {
  [key: string]: string | boolean | number | undefined | BreadSchema;
  '@type': string;
  identifier?: string;
  name?: string;
}
