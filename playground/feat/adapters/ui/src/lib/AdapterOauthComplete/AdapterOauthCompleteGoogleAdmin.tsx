import { authStatusGet } from 'playground-feat-auth-data';
import { redirect } from 'next/navigation';
import { adapterGoogleAuthComplete } from 'playground-feat-adapters-data';

export type AuthCompleteProps = {
  searchParams: Record<string, string>;
  slug: string;
};

export async function AdapterOauthCompleteGoogleAdmin(
  props: AuthCompleteProps
) {
  const authStatus = authStatusGet();

  if (!authStatus.authorized) {
    return redirect(`/login`);
  }

  const { code, state } = props.searchParams;

  if (!code || !state) {
    console.log('code or state not found');
    return redirect(`/adapters/${props.slug}`);
  }

  await adapterGoogleAuthComplete({
    code,
    state,
    slug: props.slug,
    userId: authStatus.data.userId,
  });

  redirect(`/adapters`);
}
