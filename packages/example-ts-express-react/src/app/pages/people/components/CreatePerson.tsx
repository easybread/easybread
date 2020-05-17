import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';

import { peopleCreate } from '../../../redux/features/people';
import { UtilExpandable } from '../../../ui-kit/util-kit';
import { CreatePersonButton } from './CreatePersonButton';
import { EditPersonForm, PersonFormData } from './EditPersonForm';

interface CreatePersonProps {}

export const CreatePerson: FC<CreatePersonProps> = () => {
  const dispatch = useDispatch();
  const onSubmit = (data: PersonFormData): void => {
    const { provider, email, firstName, lastName, telephone, password } = data;

    dispatch(
      peopleCreate(provider, {
        '@type': 'Person',
        telephone,
        email,
        password,
        givenName: firstName,
        familyName: lastName
      })
    );
  };
  return (
    <StyledCreatePerson>
      <UtilExpandable
        renderToggle={CreatePersonButton}
        renderContent={props => (
          <EditPersonForm onSubmit={onSubmit} {...props} />
        )}
      />
    </StyledCreatePerson>
  );
};

const StyledCreatePerson = styled.div`
  border: 2px solid var(--brand-teal);
  margin-top: var(--gap-10);
  user-select: none;
`;
