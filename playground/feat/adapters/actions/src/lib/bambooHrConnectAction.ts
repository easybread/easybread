'use server';

import { revalidatePath } from 'next/cache';
import { adapterBambooHrConnect } from 'playground-feat-adapters-data';
import { authStatusGet } from 'playground-feat-auth-data';
import { redirect } from 'next/navigation';

export async function bambooHrConnectAction(formData: FormData) {
  const apiKey = formData.get('apiKey')?.toString();
  const companyName = formData.get('companyName')?.toString();

  if (!apiKey || !companyName) return;

  const authData = await authStatusGet();

  if (!authData.authorized) return redirect('/login');

  await adapterBambooHrConnect({
    apiKey,
    companyName,
    userId: authData.data.userId,
  });

  revalidatePath('/');
}
