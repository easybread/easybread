import { PersonSchema } from '@easybread/schemas';

import { ADAPTER_NAME } from '../../../../common';

export interface PersonInfo {
  person: PersonSchema;
  provider: ADAPTER_NAME;
}

export interface PersonIdPayload {
  identifier: string;
  adapter: ADAPTER_NAME;
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
  adapter: ADAPTER_NAME,
  personId: string
): string {
  return `${adapter}:${personId}`;
}
