import { noop } from 'lodash';
import React, { FC, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styled, { css } from 'styled-components/macro';

import {
  FormButton,
  FormButtonsContainer,
  FormContainer
} from '../../../../ui-kit/form-kit';
import { AdapterContainerForm } from './AdapterContainerForm';
import { Expandable } from './Expandable';

interface AdapterProps {
  title: string;
  configured: boolean;
  onSubmit: () => void;
  onCollapse?: () => void;
  onExpand?: () => void;
  submitOnExpand?: boolean;
}

export const AdapterContainer: FC<AdapterProps> = ({
  title,
  configured,
  onCollapse = noop,
  onExpand = noop,
  onSubmit,
  children,
  submitOnExpand = false
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (): void => {
    if (configured) return;

    if (submitOnExpand && !expanded) {
      return onSubmit();
    }

    setExpanded(!expanded);
    expanded ? onCollapse() : onExpand();
  };

  const cancel = () => {
    setExpanded(false);
    onCollapse();
  };

  const submit = () => {
    setExpanded(false);
    onSubmit();
  };

  return (
    <StyledAdapterWrapper>
      <StyledAdapterTitle
        expanded={expanded}
        onClick={toggleExpanded}
        disabled={configured}
      >
        {configured ? <FaCheckCircle size={24} /> : <strong>{title}</strong>}
      </StyledAdapterTitle>

      <AdapterContainerForm expanded={expanded}>
        <FormContainer onSubmit={submit}>
          {children}

          <FormButtonsContainer>
            <StyledButton type={'button'} onClick={cancel}>
              Cancel
            </StyledButton>

            <StyledButton type={'submit'}>Save Configuration</StyledButton>
          </FormButtonsContainer>
        </FormContainer>
      </AdapterContainerForm>
    </StyledAdapterWrapper>
  );
};

const StyledButton = styled(FormButton)`
  margin-left: var(--gap-5);

  &:first-of-type {
    margin-left: 0;
  }
`;

const expandedStyle = css`
  background-color: white;
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
  }
`;
const StyledAdapterTitle = styled.div<Expandable & { disabled: boolean }>`
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

  ${p => p.disabled && disabledStyle}
  ${p => p.expanded && expandedStyle}
`;

const StyledAdapterWrapper = styled.div`
  border: 2px solid var(--brand-teal);
  margin-bottom: var(--gap-5);
  user-select: none;
`;
