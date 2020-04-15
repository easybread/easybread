import React, { FC } from 'react';
import { ContactPoint, Organization, Place } from 'schema-dts';
import styled from 'styled-components/macro';

import { CardMainInfoRow } from './CardMainInfoRow';

interface CardMainInfoProps {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  worksFor?: Organization;
  workLocation: ContactPoint | Place;
}

export const CardMainInfo: FC<CardMainInfoProps> = ({
  email,
  firstName,
  lastName,
  phone,
  jobTitle,
  worksFor,
  workLocation
}) => {
  const organizationName = !worksFor
    ? undefined
    : typeof worksFor === 'string'
    ? worksFor
    : (worksFor.name as string);

  const workLocationString = !workLocation
    ? undefined
    : typeof workLocation === 'string'
    ? workLocation
    : (workLocation.name as string);

  return (
    <StyledCardMainInfo>
      <CardMainInfoRow label={'First Name'} value={firstName} />
      <CardMainInfoRow label={'Last Name'} value={lastName} />
      <CardMainInfoRow label={'Email'} value={email} />
      <CardMainInfoRow label={'Phone'} value={phone} />
      <CardMainInfoRow label={'Title'} value={jobTitle} />
      <CardMainInfoRow label={'Organization'} value={organizationName} />
      <CardMainInfoRow label={'Work Location'} value={workLocationString} />
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
