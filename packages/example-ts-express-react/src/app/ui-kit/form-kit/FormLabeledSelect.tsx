import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { FormLabel } from './FormLabel';

export interface FormLabeledSelectOption {
  value: string;
  label: string;
}

interface FormLabeledSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: FormLabeledSelectOption[];
  required?: boolean;
}

export const FormLabeledSelect: FC<FormLabeledSelectProps> = props => {
  const { value, label, onChange, options, required = false } = props;
  return (
    <FormLabel label={label}>
      <StyledSelect
        required={required}
        value={value}
        name={label.toLowerCase()}
        onChange={event => onChange(event.target.value)}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>
    </FormLabel>
  );
};

const StyledSelect = styled.select`
  width: 100%;

  @media (min-width: 640px) {
    flex: 2;
  }
`;
