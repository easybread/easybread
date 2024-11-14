import type { AdapterOauthCompleteProps } from './AdapterOauthCompleteProps';
import { redirect } from 'next/navigation';
import { authStatusGet } from 'playground-feat-auth-data';
import { adapterBambooHrOidcComplete } from 'playground-feat-adapters-data';

export async function AdapterOauthCompleteBambooHrOidc(
  props: AdapterOauthCompleteProps
) {
  const { code, state } = await props.searchParams;

  if (!code || !state) {
    return redirect(`/adapters`);
  }

  const authStatus = await authStatusGet();

  if (!authStatus.authorized) return redirect(`/login`);

  await adapterBambooHrOidcComplete({
    code,
    userId: authStatus.data.userId,
    state: state,
  });

  return redirect(`/adapters`);
}
