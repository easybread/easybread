import { AdapterOauthCompleteGoogleAdmin } from './AdapterOauthCompleteGoogleAdmin';
import { ADAPTER_NAME, type AdapterName } from 'playground-common';

export type AdapterOauthCompleteProps = {
  slug: AdapterName;
  searchParams: Promise<Record<string, string>>;
};

export async function AdapterOauthComplete(props: AdapterOauthCompleteProps) {
  const { slug } = props;
  switch (slug) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return <AdapterOauthCompleteGoogleAdmin {...props} />;

    default:
      return <div>{`Adapter not found: ${slug}`}</div>;
  }
}
