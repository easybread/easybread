import { isString } from 'lodash';
import { Person } from 'schema-dts';

export type AdapterName = 'google' | 'bamboo';

export interface PersonInfo {
  // TODO: Person here breaks the tsc build (hangs infinitely)
  // object|string is a very simplified Thing type
  person: object | string;
  provider: AdapterName;
}

export interface PersonIdPayload {
  identifier: string;
  adapter: AdapterName;
}

export function getPersonId(person: Person): string {
  if (isString(person)) throw new Error('string person is not allowed');
  return person.identifier as string;
}

export function createPersonInfoStateIdFromPersonInfo(
  info: PersonInfo
): string {
  return createPersonInfoStateId(
    info.provider,
    getPersonId(info.person as Person)
  );
}

export function createPersonInfoStateIdFromPersonIdPayload({
  identifier,
  adapter
}: PersonIdPayload): string {
  return createPersonInfoStateId(adapter, identifier);
}

export function createPersonInfoStateId(
  adapter: AdapterName,
  personId: string
): string {
  return `${adapter}:${personId}`;
}
