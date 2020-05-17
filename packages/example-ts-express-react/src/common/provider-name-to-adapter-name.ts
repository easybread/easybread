import { BAMBOO_HR_PROVIDER_NAME } from '@easybread/adapter-bamboo-hr';
import { GOOGLE_PROVIDER_NAME } from '@easybread/adapter-google-contacts';
import { GSUITE_ADMIN_PROVIDER_NAME } from '@easybread/adapter-gsuite-admin';

import { ADAPTER_NAME } from './adapter-name';
import { ProviderName } from './provider-name';

export const providerNameToAdapterName = (
  providerName: ProviderName
): ADAPTER_NAME => {
  switch (providerName) {
    case BAMBOO_HR_PROVIDER_NAME:
      return ADAPTER_NAME.BAMBOO;
    case GOOGLE_PROVIDER_NAME:
      return ADAPTER_NAME.GOOGLE_CONTACTS;
    case GSUITE_ADMIN_PROVIDER_NAME:
      return ADAPTER_NAME.GSUITE_ADMIN;
  }
};
