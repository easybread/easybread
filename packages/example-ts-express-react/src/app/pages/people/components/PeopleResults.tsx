import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { RootState } from '../../../redux';
import { PersonInfo } from '../../../redux/features/people';
import { PersonCard } from './PersonCard';

interface PeopleResultsProps {}

export const PeopleResults: FC<PeopleResultsProps> = () => {
  const personInfos = useSelector<RootState, PersonInfo[]>(
    state => state.people.data
  );

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
