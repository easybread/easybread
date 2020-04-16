import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AdapterName = 'google' | 'bamboo';

export interface PersonInfo {
  // TODO: Person here breaks the tsc build (hangs infinitely)
  person: any;
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

export type PeopleState = LoadingState & LoadedState & ErrorState & DataState;

const initialState: PeopleState = {
  loading: { google: false, bamboo: false },
  error: { google: false, bamboo: false },
  loaded: { google: false, bamboo: false },
  data: []
};

//  ------------------------------------

interface PeopleLoadingSuccessActionPayload {
  adapter: AdapterName;
  data: PersonInfo[];
}

interface PeopleScopeStateChangePayload {
  adapter: AdapterName;
}

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    peopleLoadingStart(
      state,
      action: PayloadAction<PeopleScopeStateChangePayload>
    ) {
      const { adapter } = action.payload;
      state.loading[adapter] = true;
      state.loaded[adapter] = false;
      state.error[adapter] = false;
    },
    peopleLoadingError(
      state,
      action: PayloadAction<PeopleScopeStateChangePayload>
    ) {
      const { adapter } = action.payload;
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
    }
  }
});

export const { reducer: peopleReducer, actions: peopleActions } = peopleSlice;
