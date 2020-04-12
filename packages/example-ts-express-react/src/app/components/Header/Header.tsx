import React, { FunctionComponent } from 'react';
import styled from 'styled-components/macro';

import { px4, py3 } from '../../styles/mixins';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';

const StyledNav = styled.nav`
  display: flex;
  background-color: var(--bg-color-dark);
  color: var(--white);
  ${py3}
  ${px4}
`;

export const Header: FunctionComponent = () => {
  return (
    <StyledNav>
      <HeaderLogo />
      <HeaderNav />
    </StyledNav>
  );
};
