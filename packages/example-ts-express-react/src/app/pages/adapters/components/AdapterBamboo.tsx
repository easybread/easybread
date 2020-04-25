import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
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

  const configured = useAdapterConfigured('bamboo');

  const onSubmit = (): void => {
    dispatch(setupBamboo({ apiKey, companyName }));
  };

  const resetForm = (): void => {
    setApiKey('');
    setCompanyName('');
  };

  return (
    <AdapterContainer
      configured={configured}
      title={'Bamboo HR'}
      onCollapse={resetForm}
      onExpand={resetForm}
      onSubmit={onSubmit}
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
