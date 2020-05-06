import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';

import { ADAPTER_NAME } from '../../../common';
import { UniversalDataView } from '../../components/UniversalDataView';
import {
  peopleById,
  usePersonDetailsData,
  usePersonDetailsRawData
} from '../../redux/features/people';
import { ElementButton, ElementSpinner } from '../../ui-kit/element-kit';
import { LayoutContentWrapper } from '../../ui-kit/layout-kit';

interface PeoplePageDetailsProps {}

export const PeoplePageDetails: FC<PeoplePageDetailsProps> = () => {
  const {
    params: { adapter, identifier }
  } = useRouteMatch<{ identifier: string; adapter: ADAPTER_NAME }>();

  const dispatch = useDispatch();
  const details = usePersonDetailsData(adapter, identifier);
  const rawDetails = usePersonDetailsRawData(adapter, identifier);

  const [tab, setTab] = useState<'schema' | 'raw'>('schema');

  const showRaw = useCallback(() => setTab('raw'), []);
  const showSchema = useCallback(() => setTab('schema'), []);

  useEffect(() => {
    if (details && rawDetails) return;

    dispatch(peopleById(adapter, identifier));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, identifier, adapter]);

  if (!rawDetails || !details) {
    return (
      <LayoutContentWrapper>
        <ElementSpinner size={36} style={{ alignSelf: 'center' }} />
      </LayoutContentWrapper>
    );
  }

  return (
    <LayoutContentWrapper>
      <StyledTabSwitch>
        <ElementButton style={{ width: '45%' }} onClick={showSchema}>
          Schema Data
        </ElementButton>
        <ElementButton style={{ width: '45%' }} onClick={showRaw}>
          Raw Data
        </ElementButton>
      </StyledTabSwitch>

      {tab === 'schema' && <UniversalDataView data={details} />}
      {tab === 'raw' && <UniversalDataView data={rawDetails} />}
    </LayoutContentWrapper>
  );
};

const StyledTabSwitch = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--gap-10);
`;
