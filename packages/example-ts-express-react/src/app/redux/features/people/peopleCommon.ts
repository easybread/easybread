import { PersonSchema } from '@easybread/schemas';

export type AdapterName = 'google' | 'bamboo';

export interface PersonInfo {
  person: PersonSchema;
  provider: AdapterName;
}

export interface PersonIdPayload {
  identifier: string;
  adapter: AdapterName;
}

export function getPersonId(person: PersonSchema): string {
  return person.identifier as string;
}

export function createPersonInfoStateIdFromPersonInfo(
  info: PersonInfo
): string {
  return createPersonInfoStateId(info.provider, getPersonId(info.person));
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
