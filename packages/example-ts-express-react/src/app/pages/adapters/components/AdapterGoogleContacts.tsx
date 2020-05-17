import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ADAPTER_NAME } from '../../../../common';
import {
  resetAdapterConfiguration,
  setupGoogleContacts,
  useAdapterConfigured
} from '../../../redux/features/adapters';
import { AdapterContainer } from './Adapter';

interface GoogleAdapterProps {}

export const AdapterGoogleContacts: FC<GoogleAdapterProps> = () => {
  const dispatch = useDispatch();
  const configured = useAdapterConfigured(ADAPTER_NAME.GOOGLE_CONTACTS);

  const onSubmit = useCallback(() => dispatch(setupGoogleContacts()), [
    dispatch
  ]);

  const resetConfiguration = useCallback(() => {
    dispatch(resetAdapterConfiguration(ADAPTER_NAME.GOOGLE_CONTACTS));
  }, [dispatch]);

  return (
    <AdapterContainer
      title={'Google Contacts'}
      configured={configured}
      onSubmit={onSubmit}
      submitOnExpand={true}
      onResetConfiguration={resetConfiguration}
    />
  );
};
