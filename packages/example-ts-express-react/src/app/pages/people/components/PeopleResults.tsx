import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { PeopleResultsDto } from '../../../../dtos';
import { PersonCard } from './PersonCard';
import { PersonInfo } from './PersonInfo';

interface PeopleResultsProps {
  results: (PeopleResultsDto | null)[];
}

export const PeopleResults: FC<PeopleResultsProps> = ({ results }) => {
  const [people, setPeople] = useState<PersonInfo[]>([]);

  useEffect(() => {
    const all = results.reduce((personInfos: PersonInfo[], item) => {
      return item
        ? personInfos.concat(
            item.payload.map(p => ({
              person: p,
              provider: item.provider
            }))
          )
        : personInfos;
    }, []);

    setPeople(all);
  }, [results]);

  return (
    <StyledPeopleResults>
      {people.map((info, key) => (
        <PersonCard info={info} key={key} />
      ))}
    </StyledPeopleResults>
  );
};

const StyledPeopleResults = styled.section`
  margin-top: var(--gap-10);
`;
