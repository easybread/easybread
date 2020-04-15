import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components/macro';

import { AppRoutes } from './AppRoutes';
import { Header } from './components/Header';
import {
  useAdaptersError,
  useAdaptersLoading,
  useInitAdaptersData
} from './redux/features/adapters';
import { GlobalStyles } from './styles/GlobalStyles';
import { LayoutContentWrapper } from './ui-kit/layout-kit';

interface AppProps {}

export const App: FC<AppProps> = () => {
  const loading = useAdaptersLoading();
  const error = useAdaptersError();

  useInitAdaptersData();

  if (loading) {
    return <LayoutContentWrapper>loading</LayoutContentWrapper>;
  }

  if (error) {
    return <LayoutContentWrapper>error</LayoutContentWrapper>;
  }

  return (
    <>
      <GlobalStyles />

      <StyledWrapper>
        <BrowserRouter>
          <Header />
          <AppRoutes />
        </BrowserRouter>
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  background-color: var(--bg-color-main);
`;
