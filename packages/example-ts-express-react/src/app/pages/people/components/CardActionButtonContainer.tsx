import React, { FC } from 'react';
import styled, {
  css,
  FlattenSimpleInterpolation
} from 'styled-components/macro';

interface PersonCardActionButtonContainerProps {
  onClick: () => void;
  fillColor?: FlattenSimpleInterpolation;
}
export const CardActionButtonContainer: FC<PersonCardActionButtonContainerProps> = ({
  onClick,
  fillColor,
  children
}) => {
  return (
    <StyledWrapper fillColor={fillColor} onClick={onClick}>
      {children}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ fillColor?: FlattenSimpleInterpolation }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-left: 5px;
  border-radius: 5px;
  opacity: 0.6;
  transition: opacity 0.125s ease, color 0.125s ease, filter 0.125s ease;
  cursor: pointer;
  filter: grayscale(90%);

  color: ${p => p.fillColor || css`var(--brand-teal-desaturated-light)`};

  &:hover {
    filter: grayscale(0%);
    opacity: 0.8;
  }
`;
