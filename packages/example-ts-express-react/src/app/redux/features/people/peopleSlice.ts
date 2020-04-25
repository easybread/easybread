import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  data: PersonInfo[];
}

interface CreatePersonState {
  creatingPerson: AdaptersBooleanState;
}

export type PeopleState = LoadingState &
  LoadedState &
  ErrorState &
  DataState &
  CreatePersonState;

const initialState: PeopleState = {
  loading: { google: false, bamboo: false },
  error: { google: false, bamboo: false },
  loaded: { google: false, bamboo: false },
  creatingPerson: { google: false, bamboo: false },
  data: []
};

//  ------------------------------------

interface PeopleLoadingSuccessActionPayload {
  adapter: AdapterName;
  data: PersonInfo[];
}

interface PeopleCreateSuccessActionPayload {
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
      state.data.push(...data);
    },
    peopleCreateStart(state, action: PayloadAction<AdapterName>) {
      state.creatingPerson[action.payload] = true;
    },
    peopleCreateSuccess(
      state,
      action: PayloadAction<PeopleCreateSuccessActionPayload>
    ) {
      const { data, adapter } = action.payload;
      state.creatingPerson[adapter] = false;
      state.data.unshift(data);
    },
    peopleCreateFail(state, action: PayloadAction<AdapterName>) {
      state.creatingPerson[action.payload] = false;
    }
  }
});

export const { reducer: peopleReducer, actions: peopleActions } = peopleSlice;
