import React, { FC } from 'react';

import { FormInput } from './FormInput';
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
      <FormInput
        required={required}
        value={value}
        type={type}
        name={label.toLowerCase()}
        onChanged={onChange}
      />
    </FormLabel>
  );
};
