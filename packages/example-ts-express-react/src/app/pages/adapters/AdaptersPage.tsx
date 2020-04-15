import React, { FC } from 'react';

import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { AdapterBamboo } from './components/AdapterBamboo';
import { AdapterGoogle } from './components/AdapterGoogle';

interface AdaptersPageProps {}

export const AdaptersPage: FC<AdaptersPageProps> = ({}) => {
  return (
    <LayoutContentWrapper>
      <AdapterGoogle />
      <AdapterBamboo />
    </LayoutContentWrapper>
  );
};
