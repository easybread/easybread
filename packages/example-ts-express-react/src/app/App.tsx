import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components/macro';

import { AppRoutes } from './AppRoutes';
import { Header } from './components/Header';
import { GlobalStyles } from './styles/GlobalStyles';

interface AppProps {}

export const App: FC<AppProps> = () => {
  return (
    <div>
      <GlobalStyles />

      <StyledWrapper>
        <BrowserRouter>
          <Header />
          <AppRoutes />
        </BrowserRouter>
      </StyledWrapper>
    </div>
  );
};
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  background-color: var(--bg-color-main);
`;
