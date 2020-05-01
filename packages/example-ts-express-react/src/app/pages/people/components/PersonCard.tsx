import { OrganizationSchema, PersonSchema } from '@easybread/schemas';
import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

import {
  PersonInfo,
  useDispatchPersonDelete,
  useDispatchPersonUpdate,
  useIsPersonUpdating
} from '../../../redux/features/people';
import { ListItemContainer } from '../../../ui-kit/lists-kit';
import { CardDeleteButton } from './CardDeleteButton';
import { CardDeleteConfirm } from './CardDeleteConfirm';
import { CardEditButton } from './CardEditButton';
import { CardImage } from './CardImage';
import { CardMainInfo } from './CardMainInfo';
import { CardSpinnerOverlay } from './CardSpinnerOverlay';
import { EditPersonForm, PersonFormData } from './EditPersonForm';

interface PersonCardProps {
  info: PersonInfo;
}

const COLORS = {
  google: '#efc655',
  bamboo: '#83c158'
};

export const PersonCard: FC<PersonCardProps> = ({ info }) => {
  const { provider } = info;
  const person = info.person as PersonSchema;

  const {
    email,
    givenName,
    familyName,
    image,
    telephone,
    jobTitle,
    worksFor,
    workLocation,
    identifier
  } = person;

  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmOpened, setDeleteConfirmOpened] = useState(false);

  const isLoading = useIsPersonUpdating(info);

  // remove stuff
  const dispatchPersonDelete = useDispatchPersonDelete();
  const openDeleteConfirm = useCallback(() => setDeleteConfirmOpened(true), []);
  const cancelDelete = useCallback(() => setDeleteConfirmOpened(false), []);
  const confirmDelete = useCallback(() => {
    setDeleteConfirmOpened(false);
    dispatchPersonDelete(provider, {
      '@type': 'Person',
      identifier
    });
  }, [dispatchPersonDelete, provider, identifier]);

  // edit stuff
  const dispatchPersonUpdate = useDispatchPersonUpdate();
  const startEdit = useCallback(() => setEditMode(true), []);
  const cancelEdit = useCallback(() => setEditMode(false), []);
  const submitEdit = useCallback(
    (formData: PersonFormData) => {
      const { firstName, telephone, lastName, email } = formData;
      dispatchPersonUpdate(provider, {
        '@type': 'Person',
        identifier: identifier,
        givenName: firstName,
        familyName: lastName,
        email: email,
        telephone
      });
    },
    [identifier, dispatchPersonUpdate, provider]
  );

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
            worksFor={worksFor as OrganizationSchema}
            workLocation={workLocation as string}
          />

          <StyledActionsCorner>
            <CardEditButton onClick={startEdit} />
            <CardDeleteButton onClick={openDeleteConfirm} />
          </StyledActionsCorner>

          <CardDeleteConfirm
            opened={deleteConfirmOpened}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
          <CardSpinnerOverlay visible={isLoading} />
        </>
      )}

      {editMode && (
        <StyledFormWrapper>
          <EditPersonForm
            expanded={editMode}
            person={person}
            onSubmit={submitEdit}
            close={cancelEdit}
          />
        </StyledFormWrapper>
      )}
    </ListItemContainer>
  );
};

const StyledActionsCorner = styled.div`
  display: flex;
  position: absolute;
  top: var(--gap-4);
  right: var(--gap-4);
  margin-top: -3px;
  margin-right: -5px;
`;

const StyledFormWrapper = styled.div`
  width: 100%;
`;
