import { GoogleContactsFeed } from './google.contacts-feed.interface';

export interface GoogleContactsFeedResponse {
  version: string;
  encoding: string;
  feed: GoogleContactsFeed;
}
