'use server';

import { getCookieHandlers, login } from 'playground-feat-auth-data';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) return;

  const { setCookie, getCookie } = getCookieHandlers();

  await login({ setCookie, getCookie, email, password });

  redirect('/adapters');
}
