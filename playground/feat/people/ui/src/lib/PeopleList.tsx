import type { PersonSchema } from '@easybread/schemas';
import { Card } from 'playground-ui';

export type PeopleListProps = {
  people: PersonSchema[];
};

export function PeopleList(props: PeopleListProps) {
  const { people } = props;

  return (
    <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
      {people.map((person) => (
        <Card key={person.identifier}>
          <span className={'font-bold'}>
            {person.givenName} {person.familyName}
          </span>
          <span>{person.email}</span>
        </Card>
      ))}
    </div>
  );
}
