import { ADAPTER_NAME } from 'playground-common';

import { AdapterOauthCompleteBambooHrOidc } from './AdapterOauthCompleteBambooHrOidc';
import { AdapterOauthCompleteGoogleAdmin } from './AdapterOauthCompleteGoogleAdmin';
import type { AdapterOauthCompleteProps } from './AdapterOauthCompleteProps';

export async function AdapterOauthComplete(props: AdapterOauthCompleteProps) {
  const { slug } = props;
  switch (slug) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return <AdapterOauthCompleteGoogleAdmin {...props} />;

    case ADAPTER_NAME.BAMBOO_HR:
      return <AdapterOauthCompleteBambooHrOidc {...props} />;

    default:
      return <div>{`Adapter not found: ${slug}`}</div>;
  }
}
