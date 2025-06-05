'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { clearAuthCookies } from 'playground-feat-auth-data';

export async function logoutAction() {
  await clearAuthCookies();
  revalidatePath('/');
  redirect('/login');
}
