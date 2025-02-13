'use client';

import type { PersonSchema } from '@easybread/schemas';
import type { Adapter, SerializedDoc } from 'playground-db';
import { PageHeading } from 'playground-ui';
import { useState } from 'react';

import { PeopleList } from './PeopleList';
import { PeopleSearchForm } from './PeopleSearchForm';

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
        className={'mb-8 mt-4'}
        adapters={props.adapters}
      />
      <PeopleList people={people} />
    </>
  );
}
