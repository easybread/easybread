import { isAdapterName } from 'playground-common';
import { AdapterOauthComplete } from 'playground-feat-adapters-ui';
import { Suspense } from 'react';

type AdapterRedirectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
};

export const dynamic = 'force-dynamic';

export default async function AdapterRedirectPage(
  props: AdapterRedirectPageProps,
) {
  const { params, searchParams } = props;
  const { slug } = await params;

  if (!isAdapterName(slug)) {
    return <div>Invalid adapter name</div>;
  }

  return (
    <Suspense fallback={<div>Finishing up...</div>}>
      <AdapterOauthComplete searchParams={searchParams} slug={slug} />
    </Suspense>
  );
}
