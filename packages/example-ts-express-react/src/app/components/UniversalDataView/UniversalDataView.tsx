import React, { FC } from 'react';

import { ObjectView } from './ObjectView';

interface UniversalDataViewProps {
  data: object;
}

export const UniversalDataView: FC<UniversalDataViewProps> = ({ data }) => {
  return <ObjectView value={data} />;
};
