'use client';

import { useState } from 'react';
import type { PersonSchema } from '@easybread/schemas';
import { PeopleSearchForm } from './PeopleSearchForm';
import { PeopleList } from './PeopleList';
import { PageHeading } from 'playground-ui';
import type { Adapter, SerializedDoc } from 'playground-db';

interface PeopleSearchProps {
  adapters?: SerializedDoc<Adapter>[];
}

export function PeopleSearch(props: PeopleSearchProps) {
  const [people, setPeople] = useState<PersonSchema[]>([]);

  return (
    <>
      <PageHeading text={'People'} />
      <PeopleSearchForm
        onData={setPeople}
        className={'mt-4 mb-8'}
        adapters={props.adapters}
      />
      <PeopleList people={people} />
    </>
  );
}
