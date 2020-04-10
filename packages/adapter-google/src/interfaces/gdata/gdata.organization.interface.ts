import { GdataBoolean } from './gdata.boolean.interface';
import { GdataText } from './gdata.text.interface';

export interface GdataOrganization {
  label?: string;
  primary?: GdataBoolean;
  rel?:
    | 'http://schemas.google.com/g/2005#other'
    | 'http://schemas.google.com/g/2005#work';
  gd$orgName?: GdataText;
  gd$orgTitle?: GdataText;
}
