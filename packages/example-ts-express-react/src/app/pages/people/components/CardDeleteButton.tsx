import React, { FC } from 'react';
import { FaTrash } from 'react-icons/fa';
import { css } from 'styled-components/macro';

import { CardActionButtonContainer } from './CardActionButtonContainer';

interface PersonCardDeleteButtonProps {
  onClick: () => void;
}

export const CardDeleteButton: FC<PersonCardDeleteButtonProps> = ({
  onClick
}) => {
  return (
    <CardActionButtonContainer
      onClick={onClick}
      fillColor={css`var(--red-mid)`}
    >
      <FaTrash size={18} />
    </CardActionButtonContainer>
  );
};
