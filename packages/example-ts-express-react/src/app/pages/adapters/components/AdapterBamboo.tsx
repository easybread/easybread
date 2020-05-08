import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ADAPTER_NAME } from '../../../../common';
import {
  resetAdapterConfiguration,
  setupBamboo,
  useAdapterConfigured
} from '../../../redux/features/adapters';
import {
  FormFieldsContainer,
  FormLabeledInput
} from '../../../ui-kit/form-kit';
import { AdapterContainer } from './Adapter';

interface AdapterBambooProps {}

export const AdapterBamboo: FC<AdapterBambooProps> = () => {
  const dispatch = useDispatch();

  const [apiKey, setApiKey] = useState('');
  const [companyName, setCompanyName] = useState('');

  const configured = useAdapterConfigured(ADAPTER_NAME.BAMBOO);

  const onSubmit = useCallback((): void => {
    dispatch(setupBamboo({ apiKey, companyName }));
  }, [apiKey, companyName, dispatch]);

  const resetForm = useCallback((): void => {
    setApiKey('');
    setCompanyName('');
  }, []);

  const resetConfiguration = useCallback(() => {
    dispatch(resetAdapterConfiguration(ADAPTER_NAME.BAMBOO));
  }, [dispatch]);

  return (
    <AdapterContainer
      configured={configured}
      title={'Bamboo HR'}
      onCollapse={resetForm}
      onExpand={resetForm}
      onSubmit={onSubmit}
      onResetConfiguration={resetConfiguration}
    >
      <FormFieldsContainer>
        <FormLabeledInput
          label={'API Key'}
          value={apiKey}
          type={'text'}
          onChange={setApiKey}
        />
        <FormLabeledInput
          label={'Company Name'}
          value={companyName}
          type={'text'}
          onChange={setCompanyName}
        />
      </FormFieldsContainer>
    </AdapterContainer>
  );
};
