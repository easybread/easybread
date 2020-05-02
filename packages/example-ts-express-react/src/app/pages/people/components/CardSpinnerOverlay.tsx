import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { ElementSpinner } from '../../../ui-kit/element-kit';

interface CardSpinnerOverlayProps {
  visible: boolean;
}

export const CardSpinnerOverlay: FC<CardSpinnerOverlayProps> = ({
  visible
}) => {
  if (!visible) return null;

  return (
    <StyledWrapper>
      <ElementSpinner size={36} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-teal-desaturated-transparent);
`;
