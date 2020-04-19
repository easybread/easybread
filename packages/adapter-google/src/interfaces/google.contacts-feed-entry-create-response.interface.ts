import { GoogleContactsFeedEntry } from './google.contacts-feed-entry.interface';

export interface GoogleContactsFeedEntryCreateResponse {
  version: string;
  encoding: string;
  entry: GoogleContactsFeedEntry;
}
