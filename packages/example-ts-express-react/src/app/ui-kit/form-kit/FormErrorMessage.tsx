import React, { FC } from 'react';
import styled from 'styled-components/macro';

const StyledErrorMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 1.125rem;
  border: 2px solid var(--red-mid);
  background: var(--red-light);
  margin: var(--gap-8) 0;

  :first-child {
    margin-top: 0;
  }

  :last-child {
    margin-bottom: 0;
  }
`;
const StyledErrorMessageTitle = styled.strong``;
const StyledErrorMessageText = styled.p``;

interface FormErrorMessageProps {
  message?: string;
}

export const FormErrorMessage: FC<FormErrorMessageProps> = ({ message }) => {
  return !message ? null : (
    <StyledErrorMessageWrapper>
      <StyledErrorMessageTitle>Error</StyledErrorMessageTitle>
      <StyledErrorMessageText>{message}</StyledErrorMessageText>
    </StyledErrorMessageWrapper>
  );
};
