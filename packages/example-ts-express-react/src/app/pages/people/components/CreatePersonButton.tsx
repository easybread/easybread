import React, { FC } from 'react';
import styled, { css } from 'styled-components/macro';

import { UtilExpandableToggleProps } from '../../../ui-kit/util-kit';

interface CreatePersonButtonProps extends UtilExpandableToggleProps {}

export const CreatePersonButton: FC<CreatePersonButtonProps> = ({
  expanded,
  onClick
}) => {
  return (
    <StyledCreatePersonButton expanded={expanded} onClick={onClick}>
      CREATE CONTACT
    </StyledCreatePersonButton>
  );
};

const StyledCreatePersonButtonExpandedCSS = css`
  background-color: white;
  &:hover {
    background-color: white;
  }
`;

const StyledCreatePersonButton = styled.div<UtilExpandableToggleProps>`
  color: var(--brand-teal);
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  font-size: var(--text-lg);

  &:hover {
    color: var(--brand-teal-accent);
    background-color: var(--brand-teal-light-transparent);
  }

  ${p => p.expanded && StyledCreatePersonButtonExpandedCSS}
`;
