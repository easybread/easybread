import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { usePersonInfosArray } from '../../../redux/features/people';
import { PersonCard } from './PersonCard';

interface PeopleResultsProps {}

export const PeopleResults: FC<PeopleResultsProps> = () => {
  const personInfos = usePersonInfosArray();

  return (
    <StyledPeopleResults>
      {personInfos.map((info, key) => (
        <PersonCard info={info} key={key} />
      ))}
    </StyledPeopleResults>
  );
};

const StyledPeopleResults = styled.section`
  margin-top: var(--gap-10);
`;
