'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { adapterBreezyConnect } from 'playground-feat-adapters-data';
import { authStatusGet } from 'playground-feat-auth-data';

export async function breezyHrConnectAction(formData: FormData) {
  const username = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) return;

  const authData = await authStatusGet();

  if (!authData.authorized) return redirect('/login');

  await adapterBreezyConnect({
    ownerUserId: authData.data.userId,
    email: username,
    password,
  });

  revalidatePath('/');
}
