import type { EntityDef, RelationDef } from '@easybread/data-model';

export type RelationToPopulate = {
  id: string;
  relatedEntity: EntityDef;
  relation: RelationDef<EntityDef, EntityDef>;
  relationType: 'to' | 'from';
  subRelations: RelationToPopulate[];
};
