export type GsuiteAdminAddress = {
  type?: string;
  customType?: string;
  sourceIsStructured?: boolean;
  formatted?: string;
  poBox?: string;
  extendedAddress?: string;
  streetAddress?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  primary?: boolean;
  countryCode?: string;
};
