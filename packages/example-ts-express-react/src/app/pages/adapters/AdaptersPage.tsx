import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { container } from '../../styles/mixins';
import { AdapterBamboo } from './AdapterBamboo';
import { AdapterGoogle } from './AdapterGoogle';
import { useAdaptersData } from './hooks';

interface AdaptersPageProps {}

export const AdaptersPage: FC<AdaptersPageProps> = () => {
  const [adaptersData, refetch] = useAdaptersData();

  if (adaptersData.pending || adaptersData.idle) {
    return <StyledAdaptersList>loading</StyledAdaptersList>;
  }

  if (adaptersData.error) {
    return <StyledAdaptersList>error</StyledAdaptersList>;
  }

  return (
    <StyledAdaptersList>
      <AdapterGoogle data={adaptersData.data.google} onUpdated={refetch} />
      <AdapterBamboo data={adaptersData.data.bamboo} onUpdated={refetch} />
    </StyledAdaptersList>
  );
};

const StyledAdaptersList = styled.div`
  padding-top: 10%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  ${container}
`;
