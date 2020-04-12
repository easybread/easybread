import React, { FC } from 'react';
import styled from 'styled-components/macro';


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

const StyledInput = styled.input`
  background-color: #fff;
  appearance: none;
  width: 100%;
  padding: 0.5rem 1rem;
  color: var(--text-main-color-light);
  line-height: 1.25;
  border: 2px solid #edf2f7;

  &:focus {
    outline: 0;
    background-color: #fff;
    border-color: var(--brand-teal);
  }

  @media (min-width: 640px) {
    flex: 2;
  }
`;

interface LabeledInputProps {
  label: string;
  value: string | number;
  type: 'text' | 'password' | 'email';
  onChange: (value: any) => void;
}

export const LabeledInput: FC<LabeledInputProps> = props => {
  const { value, label, type, onChange } = props;
  return (
    <StyledLabel>
      <StyledLabelText>{label}:</StyledLabelText>
      <StyledInput
        value={value}
        type={type}
        name={label.toLowerCase()}
        onChange={event => onChange(event.target.value)}
      />
    </StyledLabel>
  );
};
