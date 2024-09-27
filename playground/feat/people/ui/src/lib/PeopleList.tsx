import type { PersonSchema } from '@easybread/schemas';
import { PeopleListItem } from './PeopleListItem';

export type PeopleListProps = {
  people: PersonSchema[];
};

export function PeopleList(props: PeopleListProps) {
  const { people } = props;

  return (
    <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'}>
      {people.map((p) => (
        <PeopleListItem person={p} key={p.identifier} />
      ))}
    </div>
  );
}
