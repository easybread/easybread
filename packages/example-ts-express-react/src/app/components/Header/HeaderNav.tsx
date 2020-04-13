import React, { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components/macro';

import { AdaptersStateDto } from '../../../dtos';
import { FetchResult } from '../../hooks/http/interfaces';

const StyledHeaderNav = styled.nav`
  display: flex;
  margin-left: var(--gap-10);
  align-items: center;
  flex: 1;
`;

const StyledLink = styled(NavLink)<NavLinkProps>`
  color: var(--text-blue-color-light);
  margin-left: var(--gap-5);

  &.active,
  :hover {
    color: var(--white);
  }
`;

interface HeaderNavProps {
  adaptersData: FetchResult<AdaptersStateDto>;
}

export const HeaderNav: FC<HeaderNavProps> = ({ adaptersData }) => {
  const { data } = adaptersData;
  const showPeople = data?.bamboo?.configured && data.google?.configured;

  return (
    <StyledHeaderNav>
      <StyledLink to={'/adapters'} activeClassName={'active'}>
        Adapters
      </StyledLink>

      {showPeople && (
        <StyledLink to={'/people'} activeClassName={'active'}>
          People
        </StyledLink>
      )}
    </StyledHeaderNav>
  );
};
