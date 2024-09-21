import { Suspense } from 'react';
import { AdapterOauthComplete } from 'playground-feat-adapters-ui';
import { isAdapterName } from 'playground-common';

type AdapterRedirectPageProps = {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
};

export default async function AdapterRedirectPage(
  props: AdapterRedirectPageProps
) {
  const { params, searchParams } = props;

  if (!isAdapterName(params.slug)) {
    return <div>Invalid adapter name</div>;
  }

  return (
    <Suspense fallback={<div>Finishing up...</div>}>
      <AdapterOauthComplete searchParams={searchParams} slug={params.slug} />
    </Suspense>
  );
}
