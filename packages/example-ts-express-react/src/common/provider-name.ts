import { BAMBOO_HR_PROVIDER_NAME } from '@easybread/adapter-bamboo-hr';
import { GOOGLE_PROVIDER_NAME } from '@easybread/adapter-google';

export type ProviderName =
  | typeof BAMBOO_HR_PROVIDER_NAME
  | typeof GOOGLE_PROVIDER_NAME;