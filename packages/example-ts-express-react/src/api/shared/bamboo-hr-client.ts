import {
  BambooHrAdapter,
  BambooHrAuthStrategy
} from '@easybread/adapter-bamboo-hr';
import { EasyBreadClient } from '@easybread/core';

import { stateAdapter } from './state-adapter';

const bambooHrAdapter = new BambooHrAdapter();
const bambooHrAuthStrategy = new BambooHrAuthStrategy(stateAdapter);

export const bambooHrClient = new EasyBreadClient(
  stateAdapter,
  bambooHrAdapter,
  bambooHrAuthStrategy
);
