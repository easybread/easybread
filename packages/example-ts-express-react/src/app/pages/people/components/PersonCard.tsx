import { OrganizationSchema } from '@easybread/schemas';
import React, { FC, MouseEventHandler, useCallback, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
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
  const { adapter, person } = info;
  const history = useHistory();
  const match = useRouteMatch();
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
    dispatchPersonDelete(adapter, {
      '@type': 'Person',
      identifier
    });
  }, [dispatchPersonDelete, adapter, identifier]);

  // edit stuff
  const dispatchPersonUpdate = useDispatchPersonUpdate();
  const startEdit = useCallback(() => setEditMode(true), []);
  const cancelEdit = useCallback(() => setEditMode(false), []);
  const submitEdit = useCallback(
    (formData: PersonFormData) => {
      const { firstName, telephone, lastName, email } = formData;
      dispatchPersonUpdate(adapter, {
        '@type': 'Person',
        identifier: identifier,
        givenName: firstName,
        familyName: lastName,
        email: email,
        telephone
      });
    },
    [identifier, dispatchPersonUpdate, adapter]
  );

  const handleClick = useCallback<MouseEventHandler>(
    _ => {
      // eslint-disable-next-line no-console
      if (editMode) return;
      history.push(`${match.path}/${adapter}/${person.identifier}`);
    },
    [adapter, editMode, history, match.path, person.identifier]
  );

  const stopPropagation = useCallback<MouseEventHandler>(event => {
    // eslint-disable-next-line no-console
    event.stopPropagation();
  }, []);

  return (
    <StyledItemContainer
      color={COLORS[adapter]}
      onClick={handleClick}
      editMode={editMode}
    >
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

          <StyledActionsCorner onClick={stopPropagation}>
            <CardEditButton onClick={startEdit} />
            <CardDeleteButton onClick={openDeleteConfirm} />
          </StyledActionsCorner>

          <CardDeleteConfirm
            onClick={stopPropagation}
            opened={deleteConfirmOpened}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
          <CardSpinnerOverlay visible={isLoading} />
        </>
      )}

      {editMode && (
        <StyledFormWrapper onClick={stopPropagation}>
          <EditPersonForm
            expanded={editMode}
            person={person}
            onSubmit={submitEdit}
            close={cancelEdit}
          />
        </StyledFormWrapper>
      )}
    </StyledItemContainer>
  );
};

const StyledItemContainer = styled(ListItemContainer)<{ editMode: boolean }>`
  cursor: ${p => (p.editMode ? 'default' : 'pointer')};
  transform: scale(1);
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  :hover {
    transform: scale(1.01);
    box-shadow: 5px 15px 0px -8px rgba(3, 26, 26, 0.1);
  }
`;

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
