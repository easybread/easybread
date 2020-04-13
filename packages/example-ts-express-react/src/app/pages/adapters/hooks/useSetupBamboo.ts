import { SetupBasicAuthOperation } from '@easybread/operations';

import { SetupBambooDto } from '../../../../dtos';
import { usePost } from '../../../hooks/http';
import {
  HttpDoneCallback,
  UsePostReturn
} from '../../../hooks/http/interfaces';

export function useSetupBamboo(
  callback: HttpDoneCallback<SetupBasicAuthOperation['output']>
): UsePostReturn<SetupBambooDto, SetupBasicAuthOperation['output']> {
  return usePost('/api/adapters/bamboo/configurations', callback);
}
