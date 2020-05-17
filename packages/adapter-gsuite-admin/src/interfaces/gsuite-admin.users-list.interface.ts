import { GsuiteAdminUser } from './gsuite-admin.user.interface';

export interface GsuiteAdminUsersList {
  kind: 'admin#directory#users';
  etag?: string;
  users: GsuiteAdminUser[];
  nextPageToken?: string;
}
