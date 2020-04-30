import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { RootState } from '../../../redux';
import { useAdapterConfigured } from '../../../redux/features/adapters';
import {
  AdaptersBooleanState,
  peopleLoad
} from '../../../redux/features/people';
import { LoadButton } from './LoadButton';

interface PeopleControlsProps {}

export const PeopleControls: FC<PeopleControlsProps> = () => {
  const bambooConfigured = useAdapterConfigured('bamboo');
  const googleConfigured = useAdapterConfigured('google');

  const dispatch = useDispatch();

  const loaded = useSelector<RootState, AdaptersBooleanState>(
    state => state.people.loaded
  );
  const loading = useSelector<RootState, AdaptersBooleanState>(
    state => state.people.loading
  );

  const fetchGoogle = (): void => {
    dispatch(peopleLoad('google'));
  };
  const fetchBamboo = (): void => {
    dispatch(peopleLoad('bamboo'));
  };

  return (
    <StyledPeopleControls>
      <StyledSectionHeading>
        <strong>Load From</strong>
      </StyledSectionHeading>
      <StyledControlsContainer>
        <LoadButton
          disabled={!googleConfigured}
          busy={loading.google}
          loaded={loaded.google}
          onClick={fetchGoogle}
        >
          Google
        </LoadButton>
        <LoadButton
          disabled={!bambooConfigured}
          busy={loading.bamboo}
          loaded={loaded.bamboo}
          onClick={fetchBamboo}
        >
          BambooHR
        </LoadButton>
      </StyledControlsContainer>
    </StyledPeopleControls>
  );
};

const StyledControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSectionHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: var(--brand-teal);
  font-size: var(--text-xlg);
  font-weight: bold;
  margin-bottom: var(--gap-10);
`;

const StyledPeopleControls = styled.section`
  display: flex;
  flex-direction: column;
`;
