import { GdataText } from './gdata';
import { GoogleContactsFeedEntry } from './google-contacts.feed-entry.interface';

export interface GoogleContactsFeed {
  entry: GoogleContactsFeedEntry[];
  openSearch$totalResults: GdataText;
  openSearch$startIndex: GdataText;
  openSearch$itemsPerPage: GdataText;
}
