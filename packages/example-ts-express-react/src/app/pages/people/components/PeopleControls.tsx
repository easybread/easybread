import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { RootState } from '../../../redux';
import {
  AdaptersBooleanState,
  loadPeople
} from '../../../redux/features/people';
import { LoadButton } from './LoadButton';

interface PeopleControlsProps {}

export const PeopleControls: FC<PeopleControlsProps> = () => {
  const dispatch = useDispatch();

  const loaded = useSelector<RootState, AdaptersBooleanState>(
    state => state.people.loaded
  );
  const loading = useSelector<RootState, AdaptersBooleanState>(
    state => state.people.loading
  );

  const fetchGoogle = (): void => {
    dispatch(loadPeople('google'));
  };
  const fetchBamboo = (): void => {
    dispatch(loadPeople('bamboo'));
  };

  return (
    <StyledPeopleControls>
      <LoadButton
        busy={loading.google}
        loaded={loaded.google}
        onClick={fetchGoogle}
      >
        Load from Google
      </LoadButton>
      <LoadButton
        busy={loading.bamboo}
        loaded={loaded.bamboo}
        onClick={fetchBamboo}
      >
        Load from BambooHR
      </LoadButton>
    </StyledPeopleControls>
  );
};

const StyledPeopleControls = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
