import { redirect } from 'next/navigation';
import { isAdapterName } from 'playground-common';
import { authStatusGet } from 'playground-feat-auth-data';
import { adapterGoogleAuthComplete } from 'playground-feat-adapters-data';
import type { AdapterOauthCompleteProps } from './AdapterOauthCompleteProps';

export async function AdapterOauthCompleteGoogleAdmin(
  props: AdapterOauthCompleteProps
) {
  const { code, state } = await props.searchParams;
  const { slug } = props;

  if (!code || !state) {
    return redirect(`/adapters`);
  }

  if (!isAdapterName(slug)) {
    return redirect(`/adapters`);
  }

  const authStatus = await authStatusGet();

  if (!authStatus.authorized) return redirect(`/login`);

  await adapterGoogleAuthComplete({
    code,
    state,
    slug,
    userId: authStatus.data.userId,
  }).catch((err) => {
    console.error(err);
  });

  return redirect(`/adapters`);
}
