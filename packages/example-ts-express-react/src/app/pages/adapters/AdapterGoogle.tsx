import React, { FC, useState } from 'react';

import { AdapterStateDto } from '../../../dtos';
import { FormFieldsContainer, LabeledInput } from '../../ui-kit/form-kit';
import { AdapterContainer } from './components/Adapter';
import { useSetupGoogle } from './hooks';

interface GoogleAdapterProps {
  data: AdapterStateDto | undefined;
  onUpdated: () => void;
}

export const AdapterGoogle: FC<GoogleAdapterProps> = ({ data, onUpdated }) => {
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('initState');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore
  const [_, setupGoogle] = useSetupGoogle(onUpdated);

  const onSubmit = (): void => {
    setupGoogle({ clientId, clientSecret });
  };

  const resetForm = (): void => {
    setClientId('');
    setClientSecret('');
  };

  return (
    <AdapterContainer
      title={'Google'}
      configured={!!data?.configured}
      onSubmit={onSubmit}
      onCollapse={resetForm}
      onExpand={resetForm}
    >
      <FormFieldsContainer>
        <LabeledInput
          label={'Client ID'}
          value={clientId}
          type={'text'}
          onChange={setClientId}
        />
        <LabeledInput
          label={'Client Secret'}
          value={clientSecret}
          type={'text'}
          onChange={setClientSecret}
        />
      </FormFieldsContainer>
    </AdapterContainer>
  );
};
