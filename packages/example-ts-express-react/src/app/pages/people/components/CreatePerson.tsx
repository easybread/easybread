import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { UtilExpandable } from '../../../ui-kit/util-kit';
import { CreatePersonButton } from './CreatePersonButton';
import { EditPersonForm, PersonFormData } from './EditPersonForm';
import { peopleCreate } from '../../../redux/features/people';
import { useDispatch } from 'react-redux';

interface CreatePersonProps {}

export const CreatePerson: FC<CreatePersonProps> = () => {
  const dispatch = useDispatch();
  const onSubmit = (data: PersonFormData): void => {
    const { provider, email, firstName, lastName, telephone } = data;

    dispatch(
      peopleCreate(provider, {
        '@type': 'Person',
        telephone,
        email,
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
