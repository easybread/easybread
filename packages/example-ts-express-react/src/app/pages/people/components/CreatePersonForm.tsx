import React, { FC, useState } from 'react';
import styled from 'styled-components/macro';

import {
  FormButton,
  FormButtonsContainer,
  FormContainer,
  FormFieldsContainer,
  FormLabeledInput,
  FormLabeledSelect
} from '../../../ui-kit/form-kit';
import { UtilExpandableContentProps } from '../../../ui-kit/util-kit';
import { AdapterName } from '../../../redux/features/people';
import { useConfiguredAdapterNames } from '../../../redux/features/adapters';
import { capitalize } from 'lodash';

export interface PersonFormData {
  email: string;
  firstName: string;
  lastName: string;
  telephone: string;
  provider: AdapterName;
}

interface CreatePersonFormProps extends UtilExpandableContentProps {
  onSubmit: (data: PersonFormData) => void;
}

export const CreatePersonForm: FC<CreatePersonFormProps> = ({
  close,
  expanded,
  onSubmit
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [provider, setProvider] = useState('');

  const adapterNames = useConfiguredAdapterNames();

  if (!expanded) return null;

  const resetForm = (): void => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setTelephone('');
  };

  const handleSubmit = (): void => {
    onSubmit({
      email,
      firstName,
      lastName,
      telephone,
      provider: provider as AdapterName
    });

    resetForm();
    close();
  };

  const onCancel = (): void => {
    close();
    resetForm();
  };

  const enableSubmit = provider && email && firstName && lastName && telephone;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormFieldsContainer>
        <FormLabeledSelect
          label={'Target'}
          value={provider}
          onChange={setProvider}
          options={[
            { label: '-- Please select --', value: '' },
            ...adapterNames.map(value => ({ label: capitalize(value), value }))
          ]}
        />

        <FormLabeledInput
          required={true}
          label={'Email'}
          value={email}
          type={'email'}
          onChange={setEmail}
        />
        <FormLabeledInput
          required={true}
          label={'First Name'}
          value={firstName}
          type={'text'}
          onChange={setFirstName}
        />
        <FormLabeledInput
          required={true}
          label={'Last Name'}
          value={lastName}
          type={'text'}
          onChange={setLastName}
        />
        <FormLabeledInput
          required={true}
          label={'telephone'}
          value={telephone}
          type={'text'}
          onChange={setTelephone}
        />
      </FormFieldsContainer>

      <FormButtonsContainer>
        <StyledButton type={'button'} onClick={onCancel}>
          Cancel
        </StyledButton>
        <StyledButton disabled={!enableSubmit} type={'submit'}>
          Submit
        </StyledButton>
      </FormButtonsContainer>
    </FormContainer>
  );
};
const StyledButton = styled(FormButton)`
  margin-left: var(--gap-5);

  &:first-of-type {
    margin-left: 0;
  }
`;
