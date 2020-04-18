import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import {
  useAdapterConfigured,
  useAdaptersInitialized,
  useAdaptersLoading
} from '../../redux/features/adapters';
import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { PeopleControls } from './components/PeopleControls';
import { PeopleResults } from './components/PeopleResults';

interface OperationsPageProps {}

export const PeoplePage: FC<OperationsPageProps> = () => {
  const bambooConfigured = useAdapterConfigured('bamboo');
  const googleConfigured = useAdapterConfigured('google');
  const adaptersLoading = useAdaptersLoading();
  const adaptersInitialized = useAdaptersInitialized();

  const canNavigate = bambooConfigured || googleConfigured;

  if (adaptersInitialized && !adaptersLoading && !canNavigate) {
    return <Redirect to={'/'} />;
  }

  return (
    <LayoutContentWrapper>
      <PeopleControls />
      <PeopleResults />
    </LayoutContentWrapper>
  );
};
