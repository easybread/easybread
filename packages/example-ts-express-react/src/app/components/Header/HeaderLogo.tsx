import React, { FunctionComponent } from 'react';
import styled from 'styled-components/macro';

import { textXL } from '../../styles/mixins';
import logo from './logo.png';

const StylesLogoHolder = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLogo = styled.img`
  fill: currentColor;
  height: 2rem;
  width: 2rem;
  margin-right: 0.5rem;
`;

const StylesLogoText = styled.span`
  ${textXL};
  font-weight: 600;
  letter-spacing: -0.025em;
`;

export const HeaderLogo: FunctionComponent = () => {
  return (
    <StylesLogoHolder>
      <StyledLogo src={logo} />
      <StylesLogoText>EasyBREAD</StylesLogoText>
    </StylesLogoHolder>
  );
};
