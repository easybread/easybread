import { PersonSchema } from '@easybread/schemas';

import { PeopleCreateResponseDto } from '../../../../api/api.dtos';
import { ADAPTER_NAME } from '../../../../common';
import { putRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError, notifyOperationResult } from '../notifications';
import { peopleActions } from './peopleSlice';

export const peopleUpdate = (
  adapter: ADAPTER_NAME,
  data: PersonSchema
): AppThunk => async dispatch => {
  const { identifier } = data;

  if (!identifier) {
    throw new Error(`can't update: identifier is empty`);
  }

  dispatch(peopleActions.peopleUpdateStart({ adapter, identifier }));

  try {
    const result = await putRequest<PersonSchema, PeopleCreateResponseDto>(
      `/api/people/${adapter}/${data.identifier}`,
      data
    );

    dispatch(notifyOperationResult(result));

    if (result.rawPayload.success) {
      dispatch(
        peopleActions.peopleUpdateSuccess({
          data: {
            person: result.payload,
            adapter
          },
          adapter
        })
      );
    } else {
      dispatch(peopleActions.peopleUpdateFail({ adapter, identifier }));
    }
  } catch (e) {
    dispatch(notifyError(`Can't update contact`, e.toString()));
    dispatch(peopleActions.peopleUpdateFail({ adapter, identifier }));
  }
};
