import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import {
  setupGoogle,
  useAdapterConfigured
} from '../../../redux/features/adapters';
import { AdapterContainer } from './Adapter';

interface GoogleAdapterProps {}

export const AdapterGoogle: FC<GoogleAdapterProps> = () => {
  const dispatch = useDispatch();
  const configured = useAdapterConfigured('google');

  const onSubmit = (): void => {
    dispatch(setupGoogle());
  };

  return (
    <AdapterContainer
      title={'Google'}
      configured={configured}
      onSubmit={onSubmit}
      submitOnExpand={true}
    />
  );
};
