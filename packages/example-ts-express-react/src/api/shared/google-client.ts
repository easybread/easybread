import { GoogleAdapter, GoogleAuthStrategy } from '@easybread/adapter-google';
import { EasyBreadClient } from '@easybread/core';

import { stateAdapter } from './state-adapter';

const googleAdapter = new GoogleAdapter();
const googleAuthStrategy = new GoogleAuthStrategy(stateAdapter);

export const googleClient = new EasyBreadClient(
  stateAdapter,
  googleAdapter,
  googleAuthStrategy
);
