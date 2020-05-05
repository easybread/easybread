import { GoogleContactsFeedEntry } from './google.contacts-feed-entry.interface';

export interface GoogleContactsFeedEntryResponse {
  version: string;
  encoding: string;
  entry: GoogleContactsFeedEntry;
}
