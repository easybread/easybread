import type { EntityDef } from '@easybread/data-model';

import { useDataModelEditor } from '../../DataModelEditorProvider';
import { isRelatedEndpoint, makeEntityId } from '../../utils';

import type { RelationToPopulate } from './types';

function makeRelationId(parentId: string, relationId: string) {
  return parentId ? `${parentId}/${relationId}` : relationId;
}

export function useCollectRelationsToPopulate() {
  const { getRelatedEntity, def } = useDataModelEditor();

  return function collect(
    entity: EntityDef,
    parentId = '',
  ): RelationToPopulate[] {
    return def.relations
      .map(r => {
        if (isRelatedEndpoint(r.from, entity)) {
          const relatedEntity = getRelatedEntity(makeEntityId(entity), r.id);
          if (!relatedEntity) return null;

          return {
            id: makeRelationId(parentId, r.id),
            relatedEntity,
            relation: r,
            relationType: 'to' as const,
            subRelations: [],
          };
        }

        if (isRelatedEndpoint(r.to, entity)) {
          const relatedEntity = getRelatedEntity(makeEntityId(entity), r.id);
          if (!relatedEntity) return null;

          return {
            id: makeRelationId(parentId, r.id),
            relatedEntity,
            relation: r,
            relationType: 'from' as const,
            subRelations: [],
          };
        }

        return null;
      })
      .filter(i => !!i);
  };
}

export function updateRelationsToPopulate(
  relations: RelationToPopulate[],
  relationId: string,
  state: boolean,
  collect: (entity: EntityDef, parentId?: string) => RelationToPopulate[],
): RelationToPopulate[] {
  return relations.map(r => {
    if (!relationId.startsWith(r.id)) return r;

    if (r.id === relationId) {
      return {
        ...r,
        subRelations: state ? collect(r.relatedEntity, r.id) : [],
      };
    }

    return {
      ...r,
      subRelations: updateRelationsToPopulate(
        r.subRelations,
        relationId,
        state,
        collect,
      ),
    };
  });
}
