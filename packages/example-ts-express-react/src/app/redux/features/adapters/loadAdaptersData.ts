import { AdaptersStateDto } from '../../../../dtos';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { adaptersActions } from './adaptersSlice';
import { notifyError } from '../notifications';

export const loadAdaptersData = (): AppThunk => async dispatch => {
  dispatch(adaptersActions.setAdaptersLoading(true));

  try {
    const { google, bamboo } = await getRequest<AdaptersStateDto>(
      '/api/adapters'
    );

    dispatch(
      adaptersActions.setAdaptersConfigured({
        google: !!google?.configured,
        bamboo: !!bamboo?.configured
      })
    );
  } catch (e) {
    dispatch(
      adaptersActions.setAdaptersConfigured({
        google: false,
        bamboo: false
      })
    );
    dispatch(adaptersActions.setAdaptersError(true));
    dispatch(notifyError(`Can't load adapters state`));
  }

  dispatch(adaptersActions.setAdaptersLoading(false));
};
