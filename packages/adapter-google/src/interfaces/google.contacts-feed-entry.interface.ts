import {
  GcontactGroupMembershipInfo,
  GContactWebsite,
  GdataEmail,
  GdataExtendedProperty,
  GdataLink,
  GdataName,
  GdataOrganization,
  GdataPhoneNumber,
  GdataText
} from './gdata';

// This interface does not reflect some properties
// that might appear on this entity
export interface GoogleContactsFeedEntry {
  id: GdataText;
  title: GdataText;
  link: GdataLink[];
  gd$email: GdataEmail[];
  gd$name: GdataName;
  gd$organization: GdataOrganization[];
  gContact$groupMembershipInfo: GcontactGroupMembershipInfo[];
  gd$extendedProperty: GdataExtendedProperty[];
  gContact$website: GContactWebsite[];
  gd$phoneNumber: GdataPhoneNumber[];
}
