import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components/macro';

import { AppRoutes } from './AppRoutes';
import { Header } from './components/Header';
import { useInitAdaptersData } from './redux/features/adapters';
import { GlobalStyles } from './styles/GlobalStyles';
import { Notifications } from './components/Notifications';

interface AppProps {}

export const App: FC<AppProps> = () => {
  useInitAdaptersData();

  return (
    <BrowserRouter>
      <GlobalStyles />

      <StyledWrapper>
        <Header />
        <AppRoutes />
        <Notifications />
      </StyledWrapper>
    </BrowserRouter>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  background-color: var(--bg-color-main);
`;
