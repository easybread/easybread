import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import {
  useAdapterConfigured,
  useAdaptersError,
  useAdaptersInitialized,
  useAdaptersLoading
} from '../../redux/features/adapters';
import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { CreatePerson } from './components/CreatePerson';
import { PeopleControls } from './components/PeopleControls';
import { PeopleResults } from './components/PeopleResults';

interface OperationsPageProps {}

export const PeoplePage: FC<OperationsPageProps> = () => {
  const loading = useAdaptersLoading();
  const error = useAdaptersError();

  const adaptersLoading = useAdaptersLoading();
  const adaptersInitialized = useAdaptersInitialized();

  const bambooConfigured = useAdapterConfigured('bamboo');
  const googleConfigured = useAdapterConfigured('google');

  if (loading) {
    return <LayoutContentWrapper>loading</LayoutContentWrapper>;
  }

  if (error) {
    return <LayoutContentWrapper>error</LayoutContentWrapper>;
  }

  const canNavigate = bambooConfigured || googleConfigured;

  if (adaptersInitialized && !adaptersLoading && !canNavigate) {
    return <Redirect to={'/'} />;
  }

  return (
    <LayoutContentWrapper>
      <PeopleControls />
      <CreatePerson />
      <PeopleResults />
    </LayoutContentWrapper>
  );
};
