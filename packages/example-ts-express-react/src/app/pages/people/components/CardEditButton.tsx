import React, { FC } from 'react';
import { FaPen } from 'react-icons/fa';
import { css } from 'styled-components';

import { CardActionButtonContainer } from './CardActionButtonContainer';

interface PersonCardEditButtonProps {
  onClick: () => void;
}

export const CardEditButton: FC<PersonCardEditButtonProps> = ({ onClick }) => {
  return (
    <CardActionButtonContainer
      onClick={onClick}
      fillColor={css`var(--brand-teal-accent)`}
    >
      <FaPen size={18} />
    </CardActionButtonContainer>
  );
};
