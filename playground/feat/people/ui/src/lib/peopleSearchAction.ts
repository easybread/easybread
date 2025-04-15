'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { AdapterName } from 'playground-common';
import { authStatusGet } from 'playground-feat-auth-data';
import { peopleSearch } from 'playground-feat-people-data';

interface PeopleSearchActionParams {
  query: string;
  adapter: AdapterName;
}

export async function peopleSearchAction({
  query,
  adapter,
}: PeopleSearchActionParams) {
  const authStatus = await authStatusGet();

  if (!authStatus.authorized) return redirect('/login');

  return await peopleSearch({
    userId: authStatus.data.userId,
    query,
    adapter,
  }).catch(error => {
    console.log(error);
    revalidatePath('/people');
    throw error;
  });
}
