import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ADAPTER_NAME } from '../../../../common';
import {
  resetAdapterConfiguration,
  setupGsuiteAdmin,
  useAdapterConfigured
} from '../../../redux/features/adapters';
import { AdapterContainer } from './Adapter';

interface AdapterGsuiteAdminProps {}

export const AdapterGsuiteAdmin: FC<AdapterGsuiteAdminProps> = () => {
  const dispatch = useDispatch();
  const configured = useAdapterConfigured(ADAPTER_NAME.GSUITE_ADMIN);

  const onSubmit = useCallback(() => dispatch(setupGsuiteAdmin()), [dispatch]);

  const resetConfiguration = useCallback(() => {
    dispatch(resetAdapterConfiguration(ADAPTER_NAME.GSUITE_ADMIN));
  }, [dispatch]);

  return (
    <AdapterContainer
      title={'GSuite'}
      configured={configured}
      onSubmit={onSubmit}
      submitOnExpand={true}
      onResetConfiguration={resetConfiguration}
    />
  );
};
