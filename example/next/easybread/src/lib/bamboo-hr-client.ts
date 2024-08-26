import {
  BambooHrAdapter,
  BambooHrAuthStrategy,
} from '@easybread/adapter-bamboo-hr';
import { EasyBreadClient } from '@easybread/core';
import { inMemoryStateAdapter } from './in-memory-state-adapter';

const bambooHrAuthStrategy = new BambooHrAuthStrategy(inMemoryStateAdapter);
const bambooHrAdapter = new BambooHrAdapter();

export const bambooHrClient = new EasyBreadClient(
  inMemoryStateAdapter,
  bambooHrAdapter,
  bambooHrAuthStrategy
);
