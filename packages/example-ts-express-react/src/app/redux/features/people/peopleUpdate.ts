import { PersonSchema } from '@easybread/schemas';

import { PeopleCreateResponseDto } from '../../../../dtos';
import { putRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { AdapterName } from './peopleCommon';
import { peopleActions } from './peopleSlice';

export const peopleUpdate = (
  adapter: AdapterName,
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
            provider: adapter
          },
          adapter
        })
      );
    } else {
      dispatch(peopleActions.peopleUpdateFail({ adapter, identifier }));
    }
  } catch (e) {
    dispatch(peopleActions.peopleUpdateFail({ adapter, identifier }));
  }
};
