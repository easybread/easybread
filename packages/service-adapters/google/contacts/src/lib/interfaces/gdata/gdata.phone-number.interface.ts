import { GdataBoolean } from './gdata.boolean.interface';
import { GdataText } from './gdata.text.interface';

export type GdataPhoneNumber = GdataText & {
  label?: string;
  rel?:
    | 'http://schemas.google.com/g/2005#fax'
    | 'http://schemas.google.com/g/2005#home'
    | 'http://schemas.google.com/g/2005#home_fax'
    | 'http://schemas.google.com/g/2005#mobile'
    | 'http://schemas.google.com/g/2005#other'
    | 'http://schemas.google.com/g/2005#pager'
    | 'http://schemas.google.com/g/2005#work'
    | 'http://schemas.google.com/g/2005#work_fax';
  uri?: string;
  primary?: GdataBoolean;
};
