import React, { FC } from 'react';
import styled, { css } from 'styled-components/macro';

import { useCreatingPerson } from '../../../redux/features/people';
import { ElementSpinner } from '../../../ui-kit/element-kit';
import { UtilExpandableToggleProps } from '../../../ui-kit/util-kit';

interface CreatePersonButtonProps extends UtilExpandableToggleProps {}

export const CreatePersonButton: FC<CreatePersonButtonProps> = ({
  expanded,
  onClick
}) => {
  const loading = useCreatingPerson();
  const handleClick = (): void => {
    if (!loading && onClick) onClick();
  };
  return (
    <StyledCreatePersonButton
      expanded={expanded}
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? <ElementSpinner /> : 'CREATE CONTACT'}
    </StyledCreatePersonButton>
  );
};

const StyledCreatePersonButtonExpandedCSS = css`
  background-color: white;
  &:hover {
    background-color: white;
  }
`;

const StyledCreatePersonButtonDisabledCSS = css`
  cursor: default;
  &:hover {
    background-color: transparent;
  }
`;

const StyledCreatePersonButton = styled.div<
  UtilExpandableToggleProps & { disabled: boolean }
>`
  color: var(--brand-teal);
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  font-size: var(--text-lg);

  :hover {
    color: var(--brand-teal-accent);
    background-color: var(--brand-teal-light-transparent);
  }

  :active {
    background: var(--brand-teal-accent-transparent);
  }

  ${p => p.expanded && StyledCreatePersonButtonExpandedCSS}
  ${p => p.disabled && StyledCreatePersonButtonDisabledCSS}
`;
