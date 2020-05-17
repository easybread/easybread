import {
  BAMBOO_HR_PROVIDER_NAME,
  BambooEmployee
} from '@easybread/adapter-bamboo-hr';
import {
  GOOGLE_PROVIDER_NAME,
  GoogleContactsFeedEntry,
  GoogleContactsPeopleByIdOperation
} from '@easybread/adapter-google-contacts';
import {
  GSUITE_ADMIN_PROVIDER_NAME,
  GsuiteAdminUser,
  GsuiteAdminUsersByIdOperation
} from '@easybread/adapter-gsuite-admin';
import { EmployeeByIdOperation } from '@easybread/operations';

import { PeopleByIdResponseDto } from '../../../../api/people/dtos';
import { ADAPTER_NAME } from '../../../../common';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError, notifyOperationResult } from '../notifications';
import { peopleActions } from './peopleSlice';

export const peopleById = (
  adapter: ADAPTER_NAME,
  identifier: string
): AppThunk => async dispatch => {
  try {
    const result = await getRequest<PeopleByIdResponseDto>(
      `/api/people/${adapter}/${identifier}`
    );

    dispatch(notifyOperationResult(result));

    if (result.rawPayload.success) {
      dispatch(
        peopleActions.byIdSuccess({
          data: {
            adapter,
            person: result.payload
          },
          rawData: { [adapter]: extractRawData(adapter, result) }
        })
      );
    }
  } catch (e) {
    dispatch(notifyError('failed to get contact by id', e.toString()));
  }
};

function extractRawData(
  adapter: ADAPTER_NAME,
  result: PeopleByIdResponseDto
): GoogleContactsFeedEntry | BambooEmployee | GsuiteAdminUser | undefined {
  if (adapter === ADAPTER_NAME.GOOGLE_CONTACTS) {
    return extractGoogleEntry(result);
  }
  if (adapter === ADAPTER_NAME.BAMBOO) {
    return extractBambooEmployee(result);
  }
  if (adapter === ADAPTER_NAME.GSUITE_ADMIN) {
    return extractGsuiteUser(result);
  }

  return undefined;
}

function extractGsuiteUser(
  result: PeopleByIdResponseDto
): GsuiteAdminUser | undefined {
  if (result.provider !== GSUITE_ADMIN_PROVIDER_NAME) {
    return undefined;
  }

  const gsuiteOutput = result as GsuiteAdminUsersByIdOperation['output'];
  return gsuiteOutput.rawPayload.success
    ? gsuiteOutput.rawPayload.data
    : undefined;
}

function extractGoogleEntry(
  result: PeopleByIdResponseDto
): GoogleContactsFeedEntry | undefined {
  if (result.provider !== GOOGLE_PROVIDER_NAME) {
    return undefined;
  }

  const googleOutput = result as GoogleContactsPeopleByIdOperation['output'];

  return googleOutput.rawPayload.success
    ? googleOutput.rawPayload.data.entry
    : undefined;
}

function extractBambooEmployee(
  result: PeopleByIdResponseDto
): BambooEmployee | undefined {
  if (result.provider !== BAMBOO_HR_PROVIDER_NAME) {
    return undefined;
  }

  const googleOutput = result as EmployeeByIdOperation<
    BambooEmployee
  >['output'];

  return googleOutput.rawPayload.success
    ? googleOutput.rawPayload.data
    : undefined;
}
