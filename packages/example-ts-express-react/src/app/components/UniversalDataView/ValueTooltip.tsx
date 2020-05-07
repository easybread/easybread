import React, { FC } from 'react';
import styled from 'styled-components/macro';

interface StyledValueTooltipProps {
  value: string;
}

export const ValueTooltip: FC<StyledValueTooltipProps> = ({ value }) => {
  return (
    <StyledWrapper>
      <span>{value}</span>
      <DownArrow />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  background-color: white;
  left: -50%;
  position: relative;
  padding: var(--gap-1) var(--gap-2);
  border-radius: 5px;
  color: var(--text-main-color-mid);
  font-size: var(--text-xs);
`;

const DownArrow = styled.i`
  position: absolute;
  bottom: -3px;
  justify-self: center;
  border: solid #ffffff;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  box-shadow: 1px 1px 0 var(--border-color);
  align-self: center;
  left: calc(50% - 5px);
`;
