import type { AdapterName } from 'playground-common';

export type AdapterOauthCompleteProps = {
  slug: AdapterName;
  searchParams: Promise<Record<string, string>>;
};
