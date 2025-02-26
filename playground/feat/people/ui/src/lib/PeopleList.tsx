import type { PersonSchema } from '@easybread/schemas';

import { PeopleListItem } from './PeopleListItem';

export type PeopleListProps = {
  people: PersonSchema[];
};

export function PeopleList(props: PeopleListProps) {
  const { people } = props;

  return (
    <div className={'min-h-80 columns-xs'}>
      {people.map(p => (
        <PeopleListItem person={p} key={p.identifier} />
      ))}
    </div>
  );
}
