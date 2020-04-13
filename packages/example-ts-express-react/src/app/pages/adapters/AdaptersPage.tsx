import React, { FC } from 'react';

import { AdaptersStateDto } from '../../../dtos';
import { FetchResult, RefetchFunction } from '../../hooks/http/interfaces';
import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { AdapterBamboo } from './components/AdapterBamboo';
import { AdapterGoogle } from './components/AdapterGoogle';

interface AdaptersPageProps {
  adaptersData: FetchResult<AdaptersStateDto>;
  refetch: RefetchFunction;
}

export const AdaptersPage: FC<AdaptersPageProps> = ({
  adaptersData,
  refetch
}) => {
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
