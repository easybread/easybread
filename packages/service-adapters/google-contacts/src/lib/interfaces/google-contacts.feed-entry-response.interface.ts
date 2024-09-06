import { GoogleContactsFeedEntry } from './google-contacts.feed-entry.interface';

export type GoogleContactsFeedEntryResponse = {
  version: string;
  encoding: string;
  entry: GoogleContactsFeedEntry;
};
