'use server';

import { revalidatePath } from 'next/cache';
import { adapterBambooHrConnect } from 'playground-feat-adapters-data';

export async function connectAction(formData: FormData) {
  const apiKey = formData.get('apiKey')?.toString();
  const companyName = formData.get('companyName')?.toString();

  if (!apiKey || !companyName) return;

  await adapterBambooHrConnect({ apiKey, companyName });

  revalidatePath('/');
}
