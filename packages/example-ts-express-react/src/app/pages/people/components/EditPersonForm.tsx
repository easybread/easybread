import { PersonSchema } from '@easybread/schemas';
import { capitalize } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';

import { ADAPTER_NAME } from '../../../../common';
import { useConfiguredAdapterNames } from '../../../redux/features/adapters';
import {
  FormButton,
  FormButtonsContainer,
  FormContainer,
  FormFieldsContainer,
  FormLabeledInput,
  FormLabeledSelect
} from '../../../ui-kit/form-kit';
import { UtilExpandableContentProps } from '../../../ui-kit/util-kit';

export interface PersonFormData {
  email: string;
  firstName: string;
  lastName: string;
  telephone: string;
  provider: ADAPTER_NAME;
}

interface CreatePersonFormProps extends UtilExpandableContentProps {
  person?: PersonSchema;
  onSubmit: (data: PersonFormData) => void;
}

export const EditPersonForm: FC<CreatePersonFormProps> = ({
  person,
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

  const editMode = useMemo(() => !!person, [person]);

  useEffect(() => {
    // TODO: those checks and type
    if (typeof person === 'undefined') return;

    const { email, telephone, givenName, familyName } = person;

    email && setEmail(email as string);
    telephone && setTelephone(telephone as string);
    givenName && setFirstName(givenName as string);
    familyName && setLastName(familyName as string);
  }, [person]);

  if (!expanded) return null;

  const resetForm = (): void => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setTelephone('');
    setProvider('');
  };

  const handleSubmit = (): void => {
    onSubmit({
      email,
      firstName,
      lastName,
      telephone,
      provider: provider as ADAPTER_NAME
    });

    resetForm();
    close();
  };

  const onCancel = (): void => {
    close();
    resetForm();
  };

  const enableSubmit = editMode
    ? email || telephone
    : provider && (email || telephone);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormFieldsContainer>
        {/* we don't need provider selector when editing */}
        {!editMode && (
          <FormLabeledSelect
            label={'Target'}
            value={provider}
            onChange={setProvider}
            options={[
              { label: '-- Please select --', value: '' },
              ...adapterNames.map(value => ({
                label: capitalize(value),
                value
              }))
            ]}
          />
        )}

        <FormLabeledInput
          label={'First Name'}
          value={firstName}
          type={'text'}
          onChange={setFirstName}
        />
        <FormLabeledInput
          label={'Last Name'}
          value={lastName}
          type={'text'}
          onChange={setLastName}
        />
        <FormLabeledInput
          required={!telephone}
          label={'Email'}
          value={email}
          type={'email'}
          onChange={setEmail}
        />
        <FormLabeledInput
          required={!email}
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
