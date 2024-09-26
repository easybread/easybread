import type { PersonSchema } from '@easybread/schemas';
import { Card } from 'playground-ui';
import Image from 'next/image';
import { PeopleListItem } from './PeopleListItem';

export type PeopleListProps = {
  people: PersonSchema[];
};

export function PeopleList(props: PeopleListProps) {
  const { people } = props;

  return (
    <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
      {people.map((p) => (
        <PeopleListItem person={p} key={p.identifier} />
      ))}
    </div>
  );
}
