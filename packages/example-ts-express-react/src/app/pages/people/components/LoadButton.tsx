import React, { FC } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styled, { css } from 'styled-components/macro';

import { ElementButton, ElementSpinner } from '../../../ui-kit/element-kit';

interface LoadButtonProps {
  busy: boolean;
  loaded: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const LoadButton: FC<LoadButtonProps> = ({
  busy,
  loaded,
  onClick,
  children,
  disabled = false
}) => {
  const innerContent = busy ? (
    <ElementSpinner />
  ) : loaded ? (
    <FaCheckCircle />
  ) : (
    children
  );

  return (
    <StyledButton
      disabled={disabled || loaded}
      busy={busy}
      loaded={loaded}
      onClick={onClick}
    >
      {innerContent}
    </StyledButton>
  );
};

const busyStyle = css`
  &,
  &:hover {
    border-color: var(--brand-teal);
    color: var(--brand-teal);
    background-color: transparent;
    cursor: default;
  }
`;
const loadedStyle = css`
  &,
  &:disabled {
    &,
    &:hover {
      border-color: var(--brand-teal);
      color: var(--brand-teal);
      background-color: transparent;
      cursor: default;
    }
  }
`;

interface StyledButtonProps {
  busy: boolean;
  loaded: boolean;
}
const StyledButton = styled(ElementButton)<StyledButtonProps>`
  margin-right: var(--gap-10);

  &:last-of-type {
    margin-right: 0;
  }

  &.disabled,
  &:disabled {
    &,
    &:hover {
      border-color: var(--brand-teal-desaturated-light);
      color: var(--brand-teal-desaturated-light);
      background-color: transparent;
    }
  }

  ${p => p.busy && busyStyle}
  ${p => p.loaded && loadedStyle}
`;
