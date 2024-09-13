import { GdataText } from './gdata.text.interface';

export type GdataName = {
  gd$fullName?: GdataText;
  gd$givenName?: GdataText;
  gd$familyName?: GdataText;
  gd$additionalName?: GdataText;
  gd$nameSuffix?: GdataText;
  gd$namePrefix?: GdataText;
};
