import { redirect } from 'next/navigation';
import { authStatusGet } from 'playground-feat-auth-data';
import { type PropsWithChildren } from 'react';

export default async function ProtectedLayout(props: PropsWithChildren) {
  const result = await authStatusGet();

  if (!result?.authorized) return redirect('/login');

  return <>{props.children}</>;
}
