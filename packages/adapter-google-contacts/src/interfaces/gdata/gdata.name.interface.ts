import { GdataText } from './gdata.text.interface';

export interface GdataName {
  gd$fullName?: GdataText;
  gd$givenName?: GdataText;
  gd$familyName?: GdataText;
  gd$additionalName?: GdataText;
  gd$nameSuffix?: GdataText;
  gd$namePrefix?: GdataText;
}
