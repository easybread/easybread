import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { CardMainInfoRow } from './CardMainInfoRow';

interface CardMainInfoProps {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export const CardMainInfo: FC<CardMainInfoProps> = ({
  email,
  firstName,
  lastName,
  phone
}) => {
  return (
    <StyledCardMainInfo>
      <CardMainInfoRow label={'First Name'} value={firstName} />
      <CardMainInfoRow label={'Last Name'} value={lastName} />
      <CardMainInfoRow label={'Email'} value={email} />
      <CardMainInfoRow label={'Phone'} value={phone} />
    </StyledCardMainInfo>
  );
};

const StyledCardMainInfo = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0 var(--gap-4);
  display: flex;
  flex-direction: column;
  flex: auto;
`;
