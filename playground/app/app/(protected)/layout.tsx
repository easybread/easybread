import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';

import { authStatusGet } from 'playground-feat-auth-data';

export default async function ProtectedLayout(props: PropsWithChildren) {
  const result = await authStatusGet();

  if (!result?.authorized) return redirect('/login');

  return <>{props.children}</>;
}
