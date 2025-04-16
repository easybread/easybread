import type { AdapterName } from 'playground-common';

export interface PeopleSearchParams {
  userId: string;
  adapter: AdapterName;
  query?: string;
}
