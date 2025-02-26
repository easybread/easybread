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
      <div className={'flex h-full items-center gap-4'}>
        <PeopleListItemPhoto person={person} />

        <div className={'flex w-full flex-col overflow-hidden'}>
          <span className={'w-full overflow-hidden text-ellipsis font-bold'}>
            {person.givenName} {person.familyName}
          </span>

          <span className={'w-full overflow-hidden text-ellipsis'}>
            {person.email}
          </span>
          {!person.workLocation ? null : (
            <span className="flex w-full items-center overflow-hidden text-ellipsis text-gray-700">
              <Icon
                iconName={'MAP_PIN'}
                size={'xs'}
                className={'mr-1 stroke-gray-500'}
              />

              {person.workLocation}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
