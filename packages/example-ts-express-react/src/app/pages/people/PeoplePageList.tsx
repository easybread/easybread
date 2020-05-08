import React, { FC } from 'react';

import {
  useAdaptersError,
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

  if (loading) {
    return <LayoutContentWrapper>loading</LayoutContentWrapper>;
  }

  if (error) {
    return <LayoutContentWrapper>error</LayoutContentWrapper>;
  }

  return (
    <LayoutContentWrapper>
      <PeopleControls />
      <CreatePerson />
      <PeopleResults />
    </LayoutContentWrapper>
  );
};
