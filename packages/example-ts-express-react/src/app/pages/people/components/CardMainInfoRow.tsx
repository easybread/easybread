import React, { FC } from 'react';
import styled from 'styled-components/macro';

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
  margin-bottom: var(--gap-2);
`;
const StyledInfoRowLabel = styled.span`
  flex-shrink: 0;
  width: 150px;
`;
const StyledInfoRowValue = styled.span`
  flex-shrink: 0;
  flex-grow: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: auto;
`;
