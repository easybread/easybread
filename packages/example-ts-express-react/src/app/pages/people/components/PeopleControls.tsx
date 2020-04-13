import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { FaCheckCircle } from 'react-icons/fa';

import { ElementButton } from '../../../ui-kit/element-kit';

interface PeopleControlsProps {
  fetch: (adapter: 'google' | 'bamboo') => void;
  fetched: {
    google: boolean;
    bamboo: boolean;
  };
}

export const PeopleControls: FC<PeopleControlsProps> = ({ fetch, fetched }) => {
  const fetchGoogle = (): void => {
    fetch('google');
  };
  const fetchBamboo = (): void => {
    fetch('bamboo');
  };

  return (
    <StyledPeopleControls>
      <StyledButton onClick={fetchGoogle} disabled={fetched.google}>
        {fetched.google ? <FaCheckCircle /> : 'Load from Google'}
      </StyledButton>
      <StyledButton onClick={fetchBamboo} disabled={fetched.bamboo}>
        {fetched.bamboo ? <FaCheckCircle /> : 'Load from BambooHR '}
      </StyledButton>
    </StyledPeopleControls>
  );
};

const StyledPeopleControls = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledButton = styled(ElementButton)`
  margin-right: var(--gap-10);
  &:last-of-type {
    margin-right: 0;
  }

  &.disabled,
  &:disabled {
    border-color: var(--brand-teal);
    color: var(--brand-teal);
  }
`;
