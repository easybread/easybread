import { PersonSchema } from '@easybread/schemas';

import { PeopleDeleteResponseDto } from '../../../../api/api.dtos';
import { ADAPTER_NAME } from '../../../../common';
import { deleteRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError, notifyOperationResult } from '../notifications';
import { peopleActions } from './peopleSlice';

export const peopleDelete = (
  adapter: ADAPTER_NAME,
  data: PersonSchema
): AppThunk => async dispatch => {
  const { identifier } = data;

  if (!identifier) {
    dispatch(notifyError('failed to remove item', 'identifier is empty'));
    return;
  }

  dispatch(peopleActions.peopleDeleteStart({ identifier, adapter }));

  try {
    const result = await deleteRequest<PeopleDeleteResponseDto>(
      `/api/people/${adapter}/${identifier}`
    );

    dispatch(notifyOperationResult(result));

    if (result.rawPayload.success) {
      dispatch(peopleActions.peopleDeleteSuccess({ identifier, adapter }));
    } else {
      dispatch(peopleActions.peopleDeleteFail({ identifier, adapter }));
    }
  } catch (e) {
    const message = e?.response?.data?.message || e.message || e.toString();
    dispatch(notifyError('failed to remove item', message));
    dispatch(peopleActions.peopleDeleteFail({ identifier, adapter }));
  }
};
