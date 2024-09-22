import { AdapterList } from 'playground-feat-adapters-ui';
import { PageHeading } from 'playground-ui';

export const revalidate = 0;

export default function AdaptersPage() {
  return (
    <>
      <PageHeading text={'Adapters'} />
      <AdapterList />
    </>
  );
}
