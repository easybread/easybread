'use server';

import { clearAuthCookies } from 'playground-feat-auth-data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  await clearAuthCookies();
  revalidatePath('/');
  redirect('/login');
}
