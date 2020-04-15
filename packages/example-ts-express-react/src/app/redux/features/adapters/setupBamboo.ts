import { BambooBasicAuthPayload } from '@easybread/adapter-bamboo-hr';
import { SetupBasicAuthOperation } from '@easybread/operations';

import { SetupBambooDto } from '../../../../dtos';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { adaptersActions } from './adaptersSlice';

export const setupBamboo = (
  data: SetupBambooDto
): AppThunk => async dispatch => {
  const result = await postRequest<
    SetupBambooDto,
    SetupBasicAuthOperation<BambooBasicAuthPayload>['output']
  >('/api/adapters/bamboo/configurations', data);

  if (!result.rawPayload.success) throw new Error('failed to setup bamboo');

  dispatch(
    adaptersActions.setAdapterConfigured({
      configured: true,
      adapter: 'bamboo'
    })
  );
};
