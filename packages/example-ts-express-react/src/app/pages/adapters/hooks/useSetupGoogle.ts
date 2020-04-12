import { SetupGoogleDto } from '../../../../dtos';
import { usePost } from '../../../hooks/http';
import {
  HttpDoneCallback,
  UsePostReturn
} from '../../../hooks/http/interfaces';

export function useSetupGoogle(
  callback: HttpDoneCallback
): UsePostReturn<SetupGoogleDto, unknown> {
  return usePost('/api/adapters/google/configurations', callback);
}
