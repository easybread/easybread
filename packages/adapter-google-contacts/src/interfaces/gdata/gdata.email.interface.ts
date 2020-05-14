export interface GdataEmail {
  address: string;
  label?: string;
  primary?: 'true' | 'false';
  rel?:
    | 'http://schemas.google.com/g/2005#home'
    | 'http://schemas.google.com/g/2005#other'
    | 'http://schemas.google.com/g/2005#work';
}
