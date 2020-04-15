import { PeopleResultsDto } from '../../../../dtos';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { peopleActions, PersonInfo } from './peopleSlice';

export const loadPeople = (
  adapter: 'google' | 'bamboo'
): AppThunk => async dispatch => {
  dispatch(peopleActions.peopleLoadingStart({ adapter }));

  try {
    const results = await getRequest<PeopleResultsDto>(
      `/api/people/${adapter}`
    );

    const personInfos: PersonInfo[] = results.payload.map(person => ({
      provider: adapter,
      person
    }));

    dispatch(
      peopleActions.peopleLoadingSuccess({
        adapter,
        data: personInfos
      })
    );
  } catch (e) {
    dispatch(peopleActions.peopleLoadingError({ adapter }));
  }
};
