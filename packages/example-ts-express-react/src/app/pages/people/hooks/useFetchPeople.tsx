import { PeopleResultsDto } from '../../../../dtos';
import { useGet } from '../../../hooks/http';
import { UseGetReturn } from '../../../hooks/http/interfaces';

export function useFetchPeople(
  adapter: 'google' | 'bamboo'
): UseGetReturn<PeopleResultsDto> {
  return useGet(`/api/people/${adapter}`);
}
