import React, { FC } from 'react';

import {
  useAdaptersError,
  useAdaptersLoading
} from '../../redux/features/adapters';
import { ElementSpinner } from '../../ui-kit/element-kit';
import { LayoutContentWrapper } from '../../ui-kit/layout-kit';
import { AdapterBamboo } from './components/AdapterBamboo';
import { AdapterGoogleContacts } from './components/AdapterGoogleContacts';
import { AdapterGsuiteAdmin } from './components/AdapterGSuiteAdmin';

interface AdaptersPageProps {}

export const AdaptersPage: FC<AdaptersPageProps> = () => {
  const loading = useAdaptersLoading();
  const error = useAdaptersError();

  if (loading) {
    return (
      <LayoutContentWrapper>
        <ElementSpinner size={36} style={{ alignSelf: 'center' }} />
      </LayoutContentWrapper>
    );
  }

  if (error) {
    return <LayoutContentWrapper>error</LayoutContentWrapper>;
  }

  return (
    <LayoutContentWrapper>
      <AdapterGoogleContacts />
      <AdapterGsuiteAdmin />
      <AdapterBamboo />
    </LayoutContentWrapper>
  );
};
