import type { BambooApplication } from './bamboo.application.interface';

export type BambooApplicationList = {
  paginationComplete: boolean;
  nextPageUrl: string | null;
  applications: BambooApplication[];
};
