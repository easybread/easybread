import type { EntityDef, RelationEndpoint } from '@easybread/data-model';

export function makeEntityId(entity: EntityDef) {
  return `${entity.namespace}.${entity.name}`;
}

export function makeEntityLabel(entity: EntityDef) {
  return `${entity.namespace}.${entity.name}`;
}

export function makeEntityIdFromRelationEndpoint(
  endpoint: RelationEndpoint<EntityDef>,
) {
  return `${endpoint.namespace}.${endpoint.entity}`;
}

export function isRelatedEndpoint(
  endpoint: RelationEndpoint<EntityDef>,
  entity: EntityDef,
) {
  return makeEntityId(entity) === makeEntityIdFromRelationEndpoint(endpoint);
}
