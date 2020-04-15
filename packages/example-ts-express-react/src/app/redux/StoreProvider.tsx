import React, { FC } from 'react';
import { Provider } from 'react-redux';

import store from './store';

interface StoreProviderProps {}

export const StoreProvider: FC<StoreProviderProps> = props => {
  return <Provider store={store}>{props.children}</Provider>;
};
