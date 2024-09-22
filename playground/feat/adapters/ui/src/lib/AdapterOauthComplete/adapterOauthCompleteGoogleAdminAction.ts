'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { authStatusGet } from 'playground-feat-auth-data';
import { adapterGoogleAuthComplete } from 'playground-feat-adapters-data';
import type { AdapterName } from 'playground-common';

export type AuthCompleteProps = {
  code: string;
  state: string;
  slug: AdapterName;
};

export async function adapterOauthCompleteGoogleAdminAction(
  props: AuthCompleteProps
) {}
