import { noop } from 'lodash';

import { AdaptersStateDto } from '../../../../dtos';
import { useGet } from '../../../hooks/http';
import { UseGetReturn } from '../../../hooks/http/interfaces';

export function useAdaptersData(): UseGetReturn<AdaptersStateDto> {
  return useGet<AdaptersStateDto>('/api/adapters', noop);
}
