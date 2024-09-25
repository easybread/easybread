import { GoogleAdminDirectoryUser } from './google-admin-directory.user.interface';

export type GoogleAdminDirectoryUsersList = {
  kind: 'admin#directory#users';
  etag?: string;
  users: GoogleAdminDirectoryUser[];
  nextPageToken?: string;
};
