'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { BambooHRAdapterConnectionMethod } from 'playground-db';
import {
  adapterBambooHrConnectApiKey,
  adapterBambooHrOidcStart,
} from 'playground-feat-adapters-data';
import { authStatusGet } from 'playground-feat-auth-data';

export async function bambooHrConnectAction(formData: FormData) {
  const apiKey = formData.get('apiKey')?.toString();
  const companyName = formData.get('companyName')?.toString();
  const mode = formData
    .get('mode')
    ?.toString() as BambooHRAdapterConnectionMethod | null;

  if (!mode) return;

  const authData = await authStatusGet();

  if (!authData.authorized) return redirect('/login');

  if (mode === 'API_KEY') {
    if (!apiKey || !companyName) return;

    await adapterBambooHrConnectApiKey({
      apiKey,
      companyName,
      userId: authData.data.userId,
    });

    revalidatePath('/');
  }

  if (mode === 'OIDC') {
    if (!companyName) return;

    const { authenticationUrl } = await adapterBambooHrOidcStart({
      companyName,
      userId: authData.data.userId,
    });

    return redirect(authenticationUrl);
  }
}
