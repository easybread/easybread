import React, { FC } from 'react';
import { FaCheckCircle, FaMinusCircle } from 'react-icons/fa';
import styled, { css } from 'styled-components/macro';

import { Expandable } from './Expandable';

interface AdapterButtonProps {
  toggleExpanded: () => void;
  resetConfiguration: () => void;
  expanded: boolean;
  title: string;
  configured: boolean;
}

export const AdapterButton: FC<AdapterButtonProps> = ({
  expanded,
  toggleExpanded,
  resetConfiguration,
  title,
  configured
}) => {
  return (
    <StyledWrapper
      onClick={toggleExpanded}
      expanded={expanded}
      disabled={configured}
    >
      {configured ? (
        <>
          <StyledFaCheckCircle size={24} />
          <StyledFaMinusCircle size={24} onClick={resetConfiguration} />
        </>
      ) : (
        <strong>{title}</strong>
      )}
    </StyledWrapper>
  );
};

const StyledFaCheckCircle = styled(FaCheckCircle)``;
const StyledFaMinusCircle = styled(FaMinusCircle)`
  display: none;
  cursor: pointer;
  color: var(--brand-red);
`;

const expandedStyle = css`
  &,
  &:hover {
    background-color: white;
  }
`;
const disabledStyle = css`
  cursor: default;
  color: var(--brand-teal);

  &:hover {
    color: var(--brand-teal);
    background-color: transparent;

    ${StyledFaCheckCircle} {
      display: none;
    }
    ${StyledFaMinusCircle} {
      display: block;
    }
  }
`;

const StyledWrapper = styled.div<Expandable & { disabled: boolean }>`
  color: var(--brand-teal);
  position: relative;
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

  ${p => p.disabled && disabledStyle}
  ${p => p.expanded && expandedStyle}
`;
