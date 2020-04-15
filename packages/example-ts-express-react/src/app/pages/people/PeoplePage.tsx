import React, { FC } from 'react';

import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { PeopleControls } from './components/PeopleControls';
import { PeopleResults } from './components/PeopleResults';

interface OperationsPageProps {}

export const PeoplePage: FC<OperationsPageProps> = () => {
  return (
    <LayoutContentWrapper>
      <PeopleControls />
      <PeopleResults />
    </LayoutContentWrapper>
  );
};
