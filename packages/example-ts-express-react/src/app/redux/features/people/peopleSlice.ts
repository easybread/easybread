import { BambooEmployee } from '@easybread/adapter-bamboo-hr';
import { GoogleContactsFeedEntry } from '@easybread/adapter-google';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { without } from 'lodash';

import { ADAPTER_NAME } from '../../../../common';
import {
  createNormalizedCollectionItem,
  createNormalizedCollectionState,
  deleteNormalizedCollectionItem,
  NormalizedCollectionState,
  updateNormalizedCollection,
  updateNormalizedCollectionItem
} from '../../util/normalized-collection';
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
  data: NormalizedCollectionState<PersonInfo>;
  rawData: {
    [ADAPTER_NAME.GOOGLE]: NormalizedCollectionState<GoogleContactsFeedEntry>;
    [ADAPTER_NAME.BAMBOO]: NormalizedCollectionState<BambooEmployee>;
  };
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

interface SearchState {
  searching: boolean;
  query: string;
}

export type PeopleState = LoadingState &
  LoadedState &
  ErrorState &
  DataState &
  CreatePersonState &
  UpdatePersonState &
  DeletePersonState &
  SearchState;

const initialState: PeopleState = {
  loading: { google: false, bamboo: false },
  error: { google: false, bamboo: false },
  loaded: { google: false, bamboo: false },
  creatingPerson: { google: false, bamboo: false },
  data: { byId: {}, ids: [] },
  rawData: {
    [ADAPTER_NAME.BAMBOO]: createNormalizedCollectionState(),
    [ADAPTER_NAME.GOOGLE]: createNormalizedCollectionState()
  },
  deletingIds: [],
  updatingIds: [],
  searching: false,
  query: ''
};

//  ------------------------------------

export interface PeopleCreateSuccessPayload {
  adapter: ADAPTER_NAME;
  data: PersonInfo;
}

export interface PeopleUpdateSuccessPayload {
  adapter: ADAPTER_NAME;
  data: PersonInfo;
}

export interface PeopleSearchStartPayload {
  query: string;
}

export interface PeopleSearchStopPayload {
  query: string;
}

export interface PeopleSearchSuccessPayload {
  query: string;
  data: PersonInfo[];
  rawData: {
    [ADAPTER_NAME.GOOGLE]?: GoogleContactsFeedEntry[];
    [ADAPTER_NAME.BAMBOO]?: BambooEmployee[];
  };
}

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    searchStart(state, action: PayloadAction<PeopleSearchStartPayload>) {
      state.searching = true;
      state.query = action.payload.query;
    },
    searchStop(state, action: PayloadAction<PeopleSearchStopPayload>) {
      if (action.payload.query === state.query) {
        state.searching = false;
      }
    },
    searchComplete(state, action: PayloadAction<PeopleSearchSuccessPayload>) {
      const { data, rawData, query } = action.payload;

      if (state.query !== query) return;

      state.searching = false;

      updateNormalizedCollection(
        state.data,
        data,
        createPersonInfoStateIdFromPersonInfo
      );

      const bambooRawData = rawData[ADAPTER_NAME.BAMBOO];
      if (bambooRawData) {
        updateNormalizedCollection(
          state.rawData[ADAPTER_NAME.BAMBOO],
          bambooRawData,
          employee => employee.id as string
        );
      }

      const googleRawData = rawData[ADAPTER_NAME.GOOGLE];
      if (googleRawData) {
        updateNormalizedCollection(
          state.rawData[ADAPTER_NAME.GOOGLE],
          googleRawData,
          contact => contact.id?.$t as string
        );
      }
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
      createNormalizedCollectionItem(
        state.data,
        data,
        createPersonInfoStateIdFromPersonInfo
      );
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
      updateNormalizedCollectionItem(
        state.data,
        action.payload.data,
        createPersonInfoStateIdFromPersonInfo
      );
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
      deleteNormalizedCollectionItem(state.data, id);
      state.deletingIds = without(state.deletingIds, id);
    }
  }
});

export const { reducer: peopleReducer, actions: peopleActions } = peopleSlice;
