import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ADAPTER_NAME } from '../../../../common';
import {
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

  return (
    <AdapterContainer
      title={'Google'}
      configured={configured}
      onSubmit={onSubmit}
      submitOnExpand={true}
    />
  );
};
