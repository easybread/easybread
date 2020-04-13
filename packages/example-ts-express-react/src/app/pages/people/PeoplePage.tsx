import React, { FC } from 'react';

import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { PeopleControls } from './components/PeopleControls';
import { PeopleResults } from './components/PeopleResults';
import { useFetchPeople } from './hooks';

interface OperationsPageProps {}

export const PeoplePage: FC<OperationsPageProps> = () => {
  const [googleResult, fetchGoogle] = useFetchPeople('google');
  const [bambooResult, fetchBamboo] = useFetchPeople('bamboo');

  const fetch = (adapter: 'google' | 'bamboo') => {
    if (adapter === 'bamboo') fetchBamboo();
    if (adapter === 'google') fetchGoogle();
  };

  return (
    <LayoutContentWrapper>
      <PeopleControls
        fetch={fetch}
        fetched={{
          bamboo: !bambooResult.idle && !bambooResult.pending,
          google: !googleResult.idle && !googleResult.pending
        }}
      />

      <PeopleResults results={[googleResult.data, bambooResult.data]} />
    </LayoutContentWrapper>
  );
};
