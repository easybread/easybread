import { AdaptersStateDto } from '../../../../api/api.dtos';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError } from '../notifications';
import { adaptersActions } from './adaptersSlice';

export const loadAdaptersData = (): AppThunk => async dispatch => {
  dispatch(adaptersActions.setAdaptersLoading(true));

  try {
    const { google, bamboo, gsuiteAdmin } = await getRequest<AdaptersStateDto>(
      '/api/adapters'
    );

    dispatch(
      adaptersActions.setAdaptersConfigured({
        google: !!google?.configured,
        bamboo: !!bamboo?.configured,
        gsuiteAdmin: !!gsuiteAdmin?.configured
      })
    );
  } catch (e) {
    dispatch(
      adaptersActions.setAdaptersConfigured({
        google: false,
        bamboo: false,
        gsuiteAdmin: false
      })
    );
    dispatch(adaptersActions.setAdaptersError(true));
    dispatch(notifyError(`Can't load adapters state`));
  }

  dispatch(adaptersActions.setAdaptersLoading(false));
};
