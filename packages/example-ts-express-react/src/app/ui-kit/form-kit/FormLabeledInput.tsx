import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { FormLabel } from './FormLabel';

interface LabeledInputProps {
  label: string;
  value: string | number;
  type: 'text' | 'password' | 'email';
  onChange: (value: any) => void;
  required?: boolean;
}

export const FormLabeledInput: FC<LabeledInputProps> = props => {
  const { value, label, type, onChange, required = false } = props;
  return (
    <FormLabel label={label}>
      <StyledInput
        required={required}
        value={value}
        type={type}
        name={label.toLowerCase()}
        onChange={event => onChange(event.target.value)}
      />
    </FormLabel>
  );
};

const StyledInput = styled.input`
  width: 100%;

  @media (min-width: 640px) {
    flex: 2;
  }
`;
