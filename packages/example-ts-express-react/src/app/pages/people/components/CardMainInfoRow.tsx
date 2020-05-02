import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { BREAKPOINTS } from '../../../styles/theme';

interface CardMainInfoRowProps {
  label: string;
  value?: string;
}

export const CardMainInfoRow: FC<CardMainInfoRowProps> = ({ label, value }) => {
  if (!value) return null;
  return (
    <StyledInfoRow>
      <StyledInfoRowLabel>{label}:</StyledInfoRowLabel>
      <StyledInfoRowValue>{value}</StyledInfoRowValue>
    </StyledInfoRow>
  );
};

const StyledInfoRow = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  margin-bottom: var(--gap-2);

  @media (max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column;
  }
`;
const StyledInfoRowLabel = styled.span`
  flex-shrink: 0;
  width: 150px;
  color: var(--text-main-color-light);
  font-weight: 300;
`;
const StyledInfoRowValue = styled.span`
  flex-shrink: 0;
  flex-grow: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: auto;
  font-weight: 400;
  color: var(--text-main-color-light);
`;
