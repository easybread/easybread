import { noop } from 'lodash';
import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

import {
  FormButton,
  FormButtonsContainer,
  FormContainer
} from '../../../../ui-kit/form-kit';
import { AdapterButton } from './AdapterButton';
import { AdapterContainerForm } from './AdapterContainerForm';

interface AdapterProps {
  title: string;
  configured: boolean;
  onSubmit: () => void;
  onResetConfiguration: () => void;
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
  onResetConfiguration,
  children,
  submitOnExpand = false
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback((): void => {
    if (configured) return;

    if (submitOnExpand && !expanded) {
      return onSubmit();
    }

    setExpanded(!expanded);
    expanded ? onCollapse() : onExpand();
  }, [configured, expanded, onCollapse, onExpand, onSubmit, submitOnExpand]);

  const cancel = useCallback(() => {
    setExpanded(false);
    onCollapse();
  }, [onCollapse]);

  const submit = useCallback(() => {
    setExpanded(false);
    onSubmit();
  }, [onSubmit]);

  return (
    <StyledAdapterWrapper>
      <AdapterButton
        expanded={expanded}
        toggleExpanded={toggleExpanded}
        title={title}
        configured={configured}
        resetConfiguration={onResetConfiguration}
      />

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

const StyledAdapterWrapper = styled.div`
  border: 2px solid var(--brand-teal);
  margin-bottom: var(--gap-5);
  user-select: none;
`;
