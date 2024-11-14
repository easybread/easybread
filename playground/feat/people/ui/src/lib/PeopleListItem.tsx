import type { PersonSchema } from '@easybread/schemas';
import { Card, Icon } from 'playground-ui';
import { PeopleListItemPhoto } from './PeopleListItemPhoto';

export type PeopleListItemProps = {
  person: PersonSchema;
};

export function PeopleListItem(props: PeopleListItemProps) {
  const { person } = props;

  return (
    <Card className={'mb-2'}>
      <div className={'flex h-full gap-4 items-center'}>
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
          {!person.workLocation ? null : (
            <span className="overflow-ellipsis w-full overflow-hidden flex items-center text-gray-700">
              <Icon
                iconName={'MAP_PIN'}
                size={'xs'}
                className={'stroke-gray-500 mr-1'}
              />

              {person.workLocation}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
