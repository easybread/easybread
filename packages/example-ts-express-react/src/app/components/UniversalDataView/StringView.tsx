import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { ImageView } from './ImageView';
import { isImage } from './isImage';
import { LabelView } from './LabelView';
import { ValueTooltip } from './ValueTooltip';

interface StringVIewProps {
  value: string;
  name?: string;
}

export const StringView: FC<StringVIewProps> = ({ value, name }) => {
  return (
    <StyledWrapper>
      {name && <LabelView>{name}:</LabelView>}

      {isImage(value) ? (
        <ImageView value={value} />
      ) : (
        <StyledValue>{value}</StyledValue>
      )}

      <StyledTooltipContainer>
        <ValueTooltip value={value} />
      </StyledTooltipContainer>
    </StyledWrapper>
  );
};
const StyledTooltipContainer = styled.div`
  position: absolute;
  opacity: 0;
  bottom: 0;
  transition: opacity 0.1s ease, bottom 0.1s ease;
  left: 50%;
  width: 0;
  overflow: hidden;
`;

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  padding: var(--gap-2) var(--gap-3);

  &:hover ${StyledTooltipContainer} {
    opacity: 1;
    bottom: 100%;
    width: auto;
    overflow: visible;
  }
`;

const StyledValue = styled.span`
  overflow: hidden;
  position: relative;
  color: var(--text-main-color-light);
  text-overflow: ellipsis;
`;
