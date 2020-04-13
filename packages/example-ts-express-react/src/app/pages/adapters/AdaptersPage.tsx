import React, { FC } from 'react';

import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { AdapterBamboo } from './components/AdapterBamboo';
import { AdapterGoogle } from './components/AdapterGoogle';
import { useAdaptersData } from './hooks';

interface AdaptersPageProps {}

export const AdaptersPage: FC<AdaptersPageProps> = () => {
  const [adaptersData, refetch] = useAdaptersData();

  if (adaptersData.pending || adaptersData.idle) {
    return <LayoutContentWrapper>loading</LayoutContentWrapper>;
  }

  if (adaptersData.error) {
    return <LayoutContentWrapper>error</LayoutContentWrapper>;
  }

  return (
    <LayoutContentWrapper>
      <AdapterGoogle data={adaptersData.data.google} onUpdated={refetch} />
      <AdapterBamboo data={adaptersData.data.bamboo} onUpdated={refetch} />
    </LayoutContentWrapper>
  );
};
