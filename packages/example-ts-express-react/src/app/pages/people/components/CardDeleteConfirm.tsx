import React, { FC, useCallback, useRef } from 'react';
import styled from 'styled-components/macro';

import { useOnClickOutside } from '../../../hooks';
import { FormButton } from '../../../ui-kit/form-kit';

interface CardDeleteConfirmProps {
  opened: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CardDeleteConfirm: FC<CardDeleteConfirmProps> = ({
  opened,
  onCancel,
  onConfirm
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const closeConfirm = useCallback(() => onCancel(), [onCancel]);

  useOnClickOutside(elementRef, closeConfirm);

  if (!opened) return null;

  return (
    <StyledConfirmContainer ref={elementRef}>
      <FormButton onClick={closeConfirm}>CANCEL</FormButton>
      <FormButton onClick={onConfirm}>DELETE</FormButton>
    </StyledConfirmContainer>
  );
};

const StyledConfirmContainer = styled.div`
  width: calc(100% - 166px);
  display: flex;
  align-items: center;
  background: white;
  padding: var(--gap-4);
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  height: 4rem;

  button {
    margin-right: var(--gap-2);
    &:last-of-type {
      margin-right: 0;
    }
  }
`;
