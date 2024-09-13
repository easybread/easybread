import { GdataText } from './gdata';
import { GoogleContactsFeedEntry } from './google-contacts.feed-entry.interface';

export type GoogleContactsFeed = {
  entry: GoogleContactsFeedEntry[];
  openSearch$totalResults: GdataText;
  openSearch$startIndex: GdataText;
  openSearch$itemsPerPage: GdataText;
};
