import { PersonSchema } from '@easybread/schemas';

import { PeopleCreateResponseDto } from '../../../../api/api.dtos';
import { ADAPTER_NAME } from '../../../../common';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError, notifyOperationResult } from '../notifications';
import { peopleActions } from './peopleSlice';

export const peopleCreate = (
  adapter: ADAPTER_NAME,
  data: PersonSchema
): AppThunk => async dispatch => {
  dispatch(peopleActions.peopleCreateStart(adapter));

  try {
    const result = await postRequest<PersonSchema, PeopleCreateResponseDto>(
      `/api/people/${adapter}`,
      data
    );

    dispatch(notifyOperationResult(result));

    if (result.rawPayload.success) {
      dispatch(
        peopleActions.peopleCreateSuccess({
          data: {
            person: result.payload,
            adapter
          },
          adapter
        })
      );
    } else {
      dispatch(peopleActions.peopleCreateFail(adapter));
    }
  } catch (e) {
    dispatch(notifyError(`Can't create contact`, e.toString()));
    dispatch(peopleActions.peopleCreateFail(adapter));
  }
};
