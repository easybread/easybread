import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { ADAPTER_NAME } from '../../../common';
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

interface PeoplePageListProps {}

export const PeoplePageList: FC<PeoplePageListProps> = () => {
  const loading = useAdaptersLoading();
  const error = useAdaptersError();

  const adaptersLoading = useAdaptersLoading();
  const adaptersInitialized = useAdaptersInitialized();

  const bambooConfigured = useAdapterConfigured(ADAPTER_NAME.BAMBOO);
  const googleConfigured = useAdapterConfigured(ADAPTER_NAME.GOOGLE);

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
