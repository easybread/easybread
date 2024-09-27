import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isAdapterName } from 'playground-common';
import { authStatusGet } from 'playground-feat-auth-data';
import { adapterGoogleAuthComplete } from 'playground-feat-adapters-data';

export type AuthCompleteProps = {
  searchParams: Record<string, string>;
  slug: string;
};

export async function AdapterOauthCompleteGoogleAdmin(
  props: AuthCompleteProps
) {
  const { code, state } = props.searchParams;
  const { slug } = props;

  if (!code || !state) {
    return redirect(`/adapters`);
  }

  if (!isAdapterName(slug)) {
    return redirect(`/adapters`);
  }

  const authStatus = authStatusGet();

  if (!authStatus.authorized) {
    return redirect(`/login`);
  }

  await adapterGoogleAuthComplete({
    code,
    state,
    slug,
    userId: authStatus.data.userId,
  });

  revalidatePath(`/`);

  return redirect(`/adapters`);
}
