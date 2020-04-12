import React, { FC, useState } from 'react';

import { AdapterStateDto } from '../../../dtos';
import { FormFieldsContainer, LabeledInput } from '../../ui-kit/form-kit';
import { AdapterContainer } from './components/Adapter';
import { useSetupBamboo } from './hooks';

interface AdapterBambooProps {
  data: AdapterStateDto | undefined;
  onUpdated: () => void;
}

export const AdapterBamboo: FC<AdapterBambooProps> = ({ data, onUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [companyName, setCompanyName] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore
  const [_, setupBamboo] = useSetupBamboo(onUpdated);

  const onSubmit = (): void => {
    // eslint-disable-next-line no-console
    setupBamboo({ apiKey, companyName });
  };

  const resetForm = () => {
    setApiKey('');
    setCompanyName('');
  };

  return (
    <AdapterContainer
      configured={!!data?.configured}
      title={'Bamboo HR'}
      onCollapse={resetForm}
      onExpand={resetForm}
      onSubmit={onSubmit}
    >
      <FormFieldsContainer>
        <LabeledInput
          label={'API Key'}
          value={apiKey}
          type={'text'}
          onChange={setApiKey}
        />
        <LabeledInput
          label={'Company Name'}
          value={companyName}
          type={'text'}
          onChange={setCompanyName}
        />
      </FormFieldsContainer>
    </AdapterContainer>
  );
};
