import React, { FC } from 'react';

import { App } from './App';
import { StoreProvider } from './redux';

interface AppRootProps {}

export const RootComponent: FC<AppRootProps> = () => {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
};
