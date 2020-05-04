import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { RootState } from '../../../redux';
import { peopleSearch } from '../../../redux/features/people';
import { PeopleSearchField } from './PeopleSearchField';

interface PeopleControlsProps {}

export const PeopleControls: FC<PeopleControlsProps> = () => {
  const dispatch = useDispatch();

  const searching = useSelector<RootState, boolean>(s => s.people.searching);
  const query = useSelector<RootState, string>(s => s.people.query);

  const search = useCallback(
    (value: string) => {
      if (value !== query || value === '') dispatch(peopleSearch(value));
    },
    [dispatch, query]
  );

  useEffect(() => {
    dispatch(peopleSearch(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledPeopleControls>
      <StyledSectionHeading>
        <strong>Preview Contacts</strong>
      </StyledSectionHeading>
      <PeopleSearchField searching={searching} query={query} search={search} />
    </StyledPeopleControls>
  );
};

const StyledSectionHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: var(--brand-teal);
  font-size: var(--text-xlg);
  font-weight: bold;
  margin-bottom: var(--gap-10);
`;

const StyledPeopleControls = styled.section`
  display: flex;
  flex-direction: column;
`;
