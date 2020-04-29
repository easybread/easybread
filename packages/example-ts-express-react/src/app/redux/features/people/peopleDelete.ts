import { isString } from 'lodash';
import { Person } from 'schema-dts';

import { PeopleDeleteResponseDto } from '../../../../dtos';
import { deleteRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { AdapterName, peopleActions } from './peopleSlice';

export const peopleDelete = (
  adapter: AdapterName,
  data: Person
): AppThunk => async dispatch => {
  if (isString(data)) throw new Error(`can't delete: person is string`);

  if (!isString(data.identifier)) {
    throw new Error(`can't delete: identifier is not a string`);
  }

  const { identifier } = data;

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
    dispatch(peopleActions.peopleDeleteFail({ identifier, adapter }));
  }
};
