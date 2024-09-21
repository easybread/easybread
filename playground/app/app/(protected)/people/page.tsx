import { PeopleSearch } from 'playground-feat-people-ui';
import { adapterListGet } from 'playground-feat-adapters-data';
import { serializeDoc } from 'playground-db';

export default async function PeoplePage() {
  const adapters = await adapterListGet();

  return (
    <div>
      <PeopleSearch adapters={adapters.map(serializeDoc)} />
    </div>
  );
}
