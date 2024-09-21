'use server';

import { logout } from 'playground-feat-auth-data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  logout();
  revalidatePath('/');
  redirect('/login');
}
