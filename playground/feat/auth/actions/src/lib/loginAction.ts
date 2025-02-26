'use server';

import { redirect } from 'next/navigation';
import { authenticate, getCookieHandlers } from 'playground-feat-auth-data';
import {
  passwordVerify,
  userCreate,
  userFindByEmailUnsafe,
} from 'playground-feat-users-data';

export async function loginAction(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) return;

  const { setCookie } = await getCookieHandlers();

  const user = await userFindByEmailUnsafe(email);

  if (!user) {
    const createdUser = await userCreate({ email, password });

    await authenticate({
      setCookie,
      data: { userId: `${createdUser._id}`, email },
    });

    return;
  }

  if (!passwordVerify(password, user.passwordHash)) {
    throw new Error('Invalid password');
  }

  await authenticate({ setCookie, data: { userId: `${user._id}`, email } });

  redirect('/adapters');
}
