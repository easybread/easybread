import { playgroundDb } from '../playgroundDb';

export type User = {
  email: string;
  passwordHash: string;
};

export type UserSafe = Omit<User, 'passwordHash'>;

export const userCollection = playgroundDb.collection<User>('users');

export function safeUser(user: User): UserSafe {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
