import React, { FC } from 'react';

import {
  useAdaptersError,
  useAdaptersLoading
} from '../../redux/features/adapters';
import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { AdapterBamboo } from './components/AdapterBamboo';
import { AdapterGoogle } from './components/AdapterGoogle';

interface AdaptersPageProps {}

export const AdaptersPage: FC<AdaptersPageProps> = () => {
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
      <AdapterGoogle />
      <AdapterBamboo />
    </LayoutContentWrapper>
  );
};
