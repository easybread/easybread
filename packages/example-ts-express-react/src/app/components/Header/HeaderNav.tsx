import React, { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useAdapterConfigured } from '../../redux/features/adapters';

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

interface HeaderNavProps {}

export const HeaderNav: FC<HeaderNavProps> = () => {
  const bambooConfigured = useAdapterConfigured('bamboo');
  const googleConfigured = useAdapterConfigured('google');

  const showPeople = bambooConfigured || googleConfigured;

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
