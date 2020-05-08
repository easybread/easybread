import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ADAPTER_NAME } from '../../../../common';
import {
  resetAdapterConfiguration,
  setupGoogle,
  useAdapterConfigured
} from '../../../redux/features/adapters';
import { AdapterContainer } from './Adapter';

interface GoogleAdapterProps {}

export const AdapterGoogle: FC<GoogleAdapterProps> = () => {
  const dispatch = useDispatch();
  const configured = useAdapterConfigured(ADAPTER_NAME.GOOGLE);

  const onSubmit = (): void => {
    dispatch(setupGoogle());
  };

  const resetConfiguration = useCallback(() => {
    dispatch(resetAdapterConfiguration(ADAPTER_NAME.GOOGLE));
  }, [dispatch]);

  return (
    <AdapterContainer
      title={'Google'}
      configured={configured}
      onSubmit={onSubmit}
      submitOnExpand={true}
      onResetConfiguration={resetConfiguration}
    />
  );
};
