'use server';

import { authStatusGet } from 'playground-feat-auth-data';
import { redirect } from 'next/navigation';

export const getStatusAction = async () => {
  const authStatus = authStatusGet();
  if (!authStatus.authorized) return redirect('/login');
  return authStatus;
};
