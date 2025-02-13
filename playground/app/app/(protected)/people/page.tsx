import { serializeDoc } from 'playground-db';
import { adapterListGet } from 'playground-feat-adapters-data';
import { PeopleSearch } from 'playground-feat-people-ui';

export const revalidate = 0;

export default async function PeoplePage() {
  const adapters = await adapterListGet();

  return (
    <div>
      <PeopleSearch adapters={adapters.map(serializeDoc)} />
    </div>
  );
}
