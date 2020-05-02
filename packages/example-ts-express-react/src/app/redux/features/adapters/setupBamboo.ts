import { BambooBasicAuthPayload } from '@easybread/adapter-bamboo-hr';
import { SetupBasicAuthOperation } from '@easybread/operations';

import { SetupBambooDto } from '../../../../api/api.dtos';
import { ADAPTER_NAME } from '../../../../common';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { adaptersActions } from './adaptersSlice';

export function setupBamboo(data: SetupBambooDto): AppThunk {
  return async dispatch => {
    const result = await postRequest<
      SetupBambooDto,
      SetupBasicAuthOperation<BambooBasicAuthPayload>['output']
    >('/api/adapters/bamboo/configurations', data);

    dispatch(notifyOperationResult(result));

    if (result.rawPayload.success) {
      dispatch(
        adaptersActions.setAdapterConfigured({
          configured: true,
          adapter: ADAPTER_NAME.BAMBOO
        })
      );
    }
  };
}
