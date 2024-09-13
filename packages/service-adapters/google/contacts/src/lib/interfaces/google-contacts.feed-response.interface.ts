import { GoogleContactsFeed } from './google-contacts.feed.interface';

export type GoogleContactsFeedResponse = {
  version: string;
  encoding: string;
  feed: GoogleContactsFeed;
};
