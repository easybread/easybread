'use server';

import { peopleSearch } from 'playground-feat-people-data';
import { authorize } from 'playground-feat-auth-data';
import type { AdapterName } from 'playground-common';

interface PeopleSearchActionParams {
  query: string;
  adapter: AdapterName;
}

export async function peopleSearchAction({
  query,
  adapter,
}: PeopleSearchActionParams) {
  const authStatus = await authorize();

  return await peopleSearch({
    userId: authStatus.data.userId,
    query,
    adapter,
  });
}
