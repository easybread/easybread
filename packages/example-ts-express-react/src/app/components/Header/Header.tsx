import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { AdaptersStateDto } from '../../../dtos';
import { FetchResult } from '../../hooks/http/interfaces';
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

interface HeaderProps {
  adaptersData: FetchResult<AdaptersStateDto>;
}

export const Header: FC<HeaderProps> = ({ adaptersData }) => {
  return (
    <StyledNav>
      <HeaderLogo />
      <HeaderNav adaptersData={adaptersData} />
    </StyledNav>
  );
};
