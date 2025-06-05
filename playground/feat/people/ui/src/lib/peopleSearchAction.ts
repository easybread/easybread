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

  const result = await peopleSearch({
    userId: authStatus.data.userId,
    query,
    adapter,
  }).catch(error => {
    console.log(error);
    revalidatePath('/people');
    throw error;
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    } as const;
  }

  return {
    success: true,
    payload: result.payload,
  } as const;
}
