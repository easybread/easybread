import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isString } from 'lodash';
import { Person } from 'schema-dts';

export type AdapterName = 'google' | 'bamboo';

export interface PersonInfo {
  // TODO: Person here breaks the tsc build (hangs infinitely)
  // object|string is a very simplified Thing type
  person: object | string;
  provider: AdapterName;
}

//  ------------------------------------

export type AdaptersBooleanState = {
  [key in AdapterName]: boolean;
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
  updatingPerson: AdaptersBooleanState;
}

export type PeopleState = LoadingState &
  LoadedState &
  ErrorState &
  DataState &
  CreatePersonState &
  UpdatePersonState;

const initialState: PeopleState = {
  loading: { google: false, bamboo: false },
  error: { google: false, bamboo: false },
  loaded: { google: false, bamboo: false },
  creatingPerson: { google: false, bamboo: false },
  updatingPerson: { google: false, bamboo: false },
  byId: {},
  ids: []
};

//  ------------------------------------

interface PeopleLoadingSuccessActionPayload {
  adapter: AdapterName;
  data: PersonInfo[];
}

interface PeopleCreateSuccessPayload {
  adapter: AdapterName;
  data: PersonInfo;
}
interface PeopleUpdateSuccessPayload {
  adapter: AdapterName;
  data: PersonInfo;
}

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    peopleLoadingStart(state, action: PayloadAction<AdapterName>) {
      const adapter = action.payload;

      state.loading[adapter] = true;
      state.loaded[adapter] = false;
      state.error[adapter] = false;
    },
    peopleLoadingError(state, action: PayloadAction<AdapterName>) {
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
        const id = createPersonInfoStateId(info);
        state.byId[id] = info;
        state.ids.unshift(id);
      });
    },

    //  CREATE ------------------------------------

    peopleCreateStart(state, action: PayloadAction<AdapterName>) {
      state.creatingPerson[action.payload] = true;
    },
    peopleCreateSuccess(
      state,
      action: PayloadAction<PeopleCreateSuccessPayload>
    ) {
      const { data, adapter } = action.payload;

      const id = createPersonInfoStateId(data);
      state.byId[id] = data;
      state.ids.unshift(id);

      state.creatingPerson[adapter] = false;
    },
    peopleCreateFail(state, action: PayloadAction<AdapterName>) {
      state.creatingPerson[action.payload] = false;
    },

    //  UPDATE ------------------------------------

    peopleUpdateStart(state, action: PayloadAction<AdapterName>) {
      state.updatingPerson[action.payload] = true;
    },
    peopleUpdateFail(state, action: PayloadAction<AdapterName>) {
      state.updatingPerson[action.payload] = false;
    },
    peopleUpdateSuccess(
      state,
      action: PayloadAction<PeopleUpdateSuccessPayload>
    ) {
      const { data, adapter } = action.payload;
      const id = createPersonInfoStateId(data);
      state.updatingPerson[adapter] = false;

      Object.assign(state.byId[id].person, data.person);
    }
  }
});

export const { reducer: peopleReducer, actions: peopleActions } = peopleSlice;

function getPersonId(person: Person): string {
  if (isString(person)) throw new Error('string person is not allowed');
  return person.identifier as string;
}

function createPersonInfoStateId(info: PersonInfo): string {
  return `${info.provider}:${getPersonId(info.person as Person)}`;
}
