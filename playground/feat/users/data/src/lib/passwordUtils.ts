import { randomBytes, pbkdf2Sync } from 'crypto';

export function passwordHash(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  // Return the salt and hash combined
  return `${salt}:${hash}`;
}

export function passwordVerify(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString(
    'hex'
  );
  return hash === verifyHash;
}
