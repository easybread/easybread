import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { useAdapterConfigured } from '../../redux/features/adapters';
import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { PeopleControls } from './components/PeopleControls';
import { PeopleResults } from './components/PeopleResults';

interface OperationsPageProps {}

export const PeoplePage: FC<OperationsPageProps> = () => {
  const bambooConfigured = useAdapterConfigured('bamboo');
  const googleConfigured = useAdapterConfigured('google');

  const canNavigate = bambooConfigured || googleConfigured;

  if (!canNavigate) {
    return <Redirect to={'/'} />;
  }

  return (
    <LayoutContentWrapper>
      <PeopleControls />
      <PeopleResults />
    </LayoutContentWrapper>
  );
};
