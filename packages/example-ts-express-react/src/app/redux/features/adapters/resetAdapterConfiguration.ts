import { AdapterStateDto } from '../../../../api/adapters/dtos';
import { ADAPTER_NAME } from '../../../../common';
import { deleteRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError } from '../notifications';
import { adaptersActions } from './adaptersSlice';

export const resetAdapterConfiguration = (
  adapter: ADAPTER_NAME
): AppThunk => async dispatch => {
  try {
    await deleteRequest<AdapterStateDto>(
      `/api/adapters/${adapter}/configurations`
    );

    dispatch(
      adaptersActions.setAdapterConfigured({
        configured: false,
        adapter
      })
    );
  } catch (e) {
    dispatch(notifyError(`Can't remove adapter configuration`, e.toString()));
  }
};
