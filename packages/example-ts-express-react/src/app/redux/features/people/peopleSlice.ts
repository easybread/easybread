import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { omit, without } from 'lodash';

import { ADAPTER_NAME } from '../../../../common';
import {
  createPersonInfoStateIdFromPersonIdPayload,
  createPersonInfoStateIdFromPersonInfo,
  PersonIdPayload,
  PersonInfo
} from './peopleCommon';

//  ------------------------------------

export type AdaptersBooleanState = {
  [key in ADAPTER_NAME]: boolean;
};

interface LoadingState {
  loading: AdaptersBooleanState;
}

interface LoadedState {
  loaded: AdaptersBooleanState;
}

interface ErrorState {
  error: AdaptersBooleanState;
}

interface DataState {
  byId: { [key: string]: PersonInfo };
  ids: string[];
}

interface CreatePersonState {
  creatingPerson: AdaptersBooleanState;
}

interface UpdatePersonState {
  updatingIds: string[];
}

interface DeletePersonState {
  deletingIds: string[];
}

export type PeopleState = LoadingState &
  LoadedState &
  ErrorState &
  DataState &
  CreatePersonState &
  UpdatePersonState &
  DeletePersonState;

const initialState: PeopleState = {
  loading: { google: false, bamboo: false },
  error: { google: false, bamboo: false },
  loaded: { google: false, bamboo: false },
  creatingPerson: { google: false, bamboo: false },
  byId: {},
  ids: [],
  deletingIds: [],
  updatingIds: []
};

//  ------------------------------------

interface PeopleLoadingSuccessActionPayload {
  adapter: ADAPTER_NAME;
  data: PersonInfo[];
}

interface PeopleCreateSuccessPayload {
  adapter: ADAPTER_NAME;
  data: PersonInfo;
}

interface PeopleUpdateSuccessPayload {
  adapter: ADAPTER_NAME;
  data: PersonInfo;
}

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    peopleLoadingStart(state, action: PayloadAction<ADAPTER_NAME>) {
      const adapter = action.payload;

      state.loading[adapter] = true;
      state.loaded[adapter] = false;
      state.error[adapter] = false;
    },
    peopleLoadingError(state, action: PayloadAction<ADAPTER_NAME>) {
      const adapter = action.payload;

      state.loading[adapter] = false;
      state.loaded[adapter] = false;
      state.error[adapter] = true;
    },
    peopleLoadingSuccess(
      state,
      action: PayloadAction<PeopleLoadingSuccessActionPayload>
    ) {
      const { adapter, data } = action.payload;

      state.loading[adapter] = false;
      state.loaded[adapter] = true;
      state.error[adapter] = false;

      data.forEach(info => {
        const id = createPersonInfoStateIdFromPersonInfo(info);
        state.byId[id] = info;
        state.ids.unshift(id);
      });
    },

    //  CREATE ------------------------------------

    peopleCreateStart(state, action: PayloadAction<ADAPTER_NAME>) {
      state.creatingPerson[action.payload] = true;
    },
    peopleCreateSuccess(
      state,
      action: PayloadAction<PeopleCreateSuccessPayload>
    ) {
      const { data, adapter } = action.payload;

      const id = createPersonInfoStateIdFromPersonInfo(data);
      state.byId[id] = data;
      state.ids.unshift(id);

      state.creatingPerson[adapter] = false;
    },
    peopleCreateFail(state, action: PayloadAction<ADAPTER_NAME>) {
      state.creatingPerson[action.payload] = false;
    },

    //  UPDATE ------------------------------------

    peopleUpdateStart(state, action: PayloadAction<PersonIdPayload>) {
      state.updatingIds.push(
        createPersonInfoStateIdFromPersonIdPayload(action.payload)
      );
    },
    peopleUpdateFail(state, action: PayloadAction<PersonIdPayload>) {
      state.updatingIds = without(
        state.updatingIds,
        createPersonInfoStateIdFromPersonIdPayload(action.payload)
      );
    },
    peopleUpdateSuccess(
      state,
      action: PayloadAction<PeopleUpdateSuccessPayload>
    ) {
      const { data } = action.payload;
      const id = createPersonInfoStateIdFromPersonInfo(data);

      state.updatingIds = without(state.updatingIds, id);

      Object.assign(state.byId[id].person, data.person);
    },

    // REMOVE ------------------------------------

    peopleDeleteStart(state, action: PayloadAction<PersonIdPayload>) {
      state.deletingIds.unshift(
        createPersonInfoStateIdFromPersonIdPayload(action.payload)
      );
    },
    peopleDeleteFail(state, action: PayloadAction<PersonIdPayload>) {
      state.deletingIds = without(
        state.deletingIds,
        createPersonInfoStateIdFromPersonIdPayload(action.payload)
      );
    },
    peopleDeleteSuccess(state, action: PayloadAction<PersonIdPayload>) {
      const id = createPersonInfoStateIdFromPersonIdPayload(action.payload);

      state.deletingIds = without(state.deletingIds, id);
      state.ids = without(state.ids, id);

      omit(state.byId, id);
    }
  }
});

export const { reducer: peopleReducer, actions: peopleActions } = peopleSlice;
