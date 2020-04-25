import React, { FC } from 'react';
import styled from 'styled-components/macro';

interface FormLabelProps {
  label: string;
}

export const FormLabel: FC<FormLabelProps> = ({ label, children }) => {
  return (
    <StyledLabel>
      <StyledLabelText>{label}:</StyledLabelText>
      {children}
    </StyledLabel>
  );
};

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  &:last-of-type {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const StyledLabelText = styled.span`
  color: var(--text-main-color-light);
  margin-bottom: 0.25rem;
  padding-right: 1rem;

  @media (min-width: 640px) {
    flex: 1 1 0%;
    flex-shrink: 0;
    text-align: right;
    margin-bottom: 0;
  }
`;
