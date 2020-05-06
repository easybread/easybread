import React, { FC } from 'react';
import styled from 'styled-components/macro';

interface StringVIewProps {
  value: string;
  name?: string;
}

export const StringView: FC<StringVIewProps> = ({ value, name }) => {
  return (
    <StyledWrapper>
      {name && <StyledLabel>{name}:</StyledLabel>}
      <StyledValue>{value}</StyledValue>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: var(--gap-2) var(--gap-3);
`;

const StyledLabel = styled.span`
  color: var(--text-brand-color-mid);
  margin-right: var(--gap-3);
`;

const StyledValue = styled.span`
  overflow: hidden;
  color: var(--text-main-color-light);
`;
