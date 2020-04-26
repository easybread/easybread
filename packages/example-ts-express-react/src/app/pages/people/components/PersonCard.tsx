import React, { FC, useState } from 'react';
import { FaPenSquare } from 'react-icons/fa';
import { Organization, Person } from 'schema-dts';
import styled from 'styled-components/macro';

import {
  PersonInfo,
  useDispatchPersonUpdate
} from '../../../redux/features/people';
import { ListItemContainer } from '../../../ui-kit/lists-kit';
import { CardImage } from './CardImage';
import { CardMainInfo } from './CardMainInfo';
import { EditPersonForm, PersonFormData } from './EditPersonForm';

interface PersonCardProps {
  info: PersonInfo;
}

const COLORS = {
  google: '#efc655',
  bamboo: '#83c158'
};

export const PersonCard: FC<PersonCardProps> = ({ info }) => {
  const [editMode, setEditMode] = useState(false);
  const dispatchPersonUpdate = useDispatchPersonUpdate();

  const { provider } = info;

  const person = info.person as Person;

  if (typeof person === 'string') return null;

  const {
    email,
    givenName,
    familyName,
    image,
    telephone,
    jobTitle,
    worksFor,
    workLocation
  } = person;

  const edit = (): void => {
    setEditMode(true);
  };

  const cancelEdit = (): void => {
    setEditMode(false);
  };

  const onSubmit = (formData: PersonFormData): void => {
    const { firstName, telephone, lastName, email } = formData;
    dispatchPersonUpdate(provider, {
      '@type': 'Person',
      identifier: person.identifier,
      givenName: firstName,
      familyName: lastName,
      email: email,
      telephone
    });
  };

  return (
    <ListItemContainer color={COLORS[provider]}>
      {!editMode && (
        <>
          <CardImage image={image as string} />
          <CardMainInfo
            email={email as string}
            firstName={givenName as string}
            lastName={familyName as string}
            phone={telephone as string}
            jobTitle={jobTitle as string}
            worksFor={worksFor as Organization}
            workLocation={workLocation as string}
          />

          <StyledEditOverlay onClick={edit}>
            <FaPenSquare size={26} />
          </StyledEditOverlay>
        </>
      )}

      {editMode && (
        <StyledFormWrapper>
          <EditPersonForm
            expanded={editMode}
            person={person}
            onSubmit={onSubmit}
            close={cancelEdit}
          />
        </StyledFormWrapper>
      )}
    </ListItemContainer>
  );
};

const StyledEditOverlay = styled.div`
  position: absolute;
  top: var(--gap-4);
  right: var(--gap-4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-top: -7px;
  margin-right: -7px;
  border-radius: 5px;
  //background: rgba(163, 221, 224, 0.2);
  opacity: 0.6;
  transition: opacity 0.1s ease, color 0.1s ease;
  cursor: pointer;
  color: var(--brand-teal-desaturated-light);

  &:hover {
    color: var(--brand-teal-accent);
    opacity: 1;
  }
`;

const StyledFormWrapper = styled.div`
  width: 100%;
`;
