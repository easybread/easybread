import React, { FC, FormEventHandler, FormHTMLAttributes } from 'react';
import styled from 'styled-components/macro';

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: () => any;
}

export const FormContainer: FC<FormContainerProps> = ({
  onSubmit,
  ...rest
}) => {
  const handleSubmit: FormEventHandler = event => {
    event.preventDefault();
    onSubmit();
  };
  return <StyledFormContainer onSubmit={handleSubmit} {...rest} />;
};

const StyledFormContainer = styled.form`
  background: var(--bg-color-white);
`;
