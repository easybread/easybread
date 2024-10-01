import type { PersonSchema } from '@easybread/schemas';
import { Card } from 'playground-ui';
import { PeopleListItemPhoto } from './PeopleListItemPhoto';

export type PeopleListItemProps = {
  person: PersonSchema;
};

export function PeopleListItem(props: PeopleListItemProps) {
  const { person } = props;

  return (
    <Card>
      <div className={'flex gap-4 items-center'}>
        <PeopleListItemPhoto person={person} />

        <div className={'w-full flex flex-col overflow-hidden'}>
          <span
            className={'font-bold overflow-ellipsis w-full overflow-hidden'}
          >
            {person.givenName} {person.familyName}
          </span>

          <span className={'overflow-ellipsis w-full overflow-hidden'}>
            {person.email}
          </span>
        </div>
      </div>
    </Card>
  );
}
