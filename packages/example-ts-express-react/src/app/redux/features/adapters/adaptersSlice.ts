import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdaptersBooleanState {
  google: boolean;
  bamboo: boolean;
}

interface AdaptersLoadingState {
  loading: boolean;
}

interface AdaptersErrorState {
  error: boolean;
}

interface AdaptersConfiguredState {
  configured: AdaptersBooleanState;
}

interface AdaptersInitializedState {
  initialized: boolean;
}

export type AdaptersState = AdaptersLoadingState &
  AdaptersConfiguredState &
  AdaptersErrorState &
  AdaptersInitializedState;

//  ------------------------------------

const initialState: AdaptersState = {
  configured: { bamboo: false, google: false },
  loading: false,
  error: false,
  initialized: false
};

//  ------------------------------------

interface SetAdapterConfiguredPayload {
  adapter: 'google' | 'bamboo';
  configured: boolean;
}

const adaptersSlice = createSlice({
  name: 'adapters',
  initialState,
  reducers: {
    setAdaptersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAdaptersConfigured(state, action: PayloadAction<AdaptersBooleanState>) {
      state.configured = action.payload;
      state.initialized = true;
    },
    setAdaptersError(state, action: PayloadAction<boolean>) {
      state.error = action.payload;
      state.initialized = true;
    },
    setAdapterConfigured(
      state,
      action: PayloadAction<SetAdapterConfiguredPayload>
    ) {
      const { adapter, configured } = action.payload;
      state.configured[adapter] = configured;
    }
  }
});

export const {
  reducer: adaptersReducer,
  actions: adaptersActions
} = adaptersSlice;