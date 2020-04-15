import React, { FC } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styled from 'styled-components/macro';

import { ElementButton, ElementSpinner } from '../../../ui-kit/element-kit';

interface LoadButtonProps {
  busy: boolean;
  loaded: boolean;
  onClick: () => void;
}

export const LoadButton: FC<LoadButtonProps> = ({
  busy,
  loaded,
  onClick,
  children
}) => {
  const innerContent = busy ? (
    <ElementSpinner />
  ) : loaded ? (
    <FaCheckCircle />
  ) : (
    children
  );

  return (
    <StyledButton disabled={loaded} onClick={onClick}>
      {innerContent}
    </StyledButton>
  );
};

const StyledButton = styled(ElementButton)`
  margin-right: var(--gap-10);
  &:last-of-type {
    margin-right: 0;
  }

  &.disabled,
  &:disabled {
    border-color: var(--brand-teal);
    color: var(--brand-teal);
  }
`;
