import { AdapterOauthCompleteGoogleAdmin } from './AdapterOauthCompleteGoogleAdmin';
import { ADAPTER_NAME, type AdapterName } from 'playground-common';

export type AdapterOauthCompleteProps = {
  slug: AdapterName;
  searchParams: Record<string, string>;
};

export async function AdapterOauthComplete(props: AdapterOauthCompleteProps) {
  switch (props.slug) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return <AdapterOauthCompleteGoogleAdmin {...props} />;

    default:
      return <div>{`Adapter not found: ${props.slug}`}</div>;
  }
}
