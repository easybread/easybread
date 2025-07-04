import { type Node, type NodeProps, Position } from '@xyflow/react';
import { useState } from 'react';

import {
  DataModelDef,
  EntityDef,
  RELATION_MULTIPLICITY,
  RelationDef,
  RelationEndpoint,
} from '@easybread/data-model';

import { Checkbox } from '../../../../shadcn/checkbox';
import { Label } from '../../../../shadcn/label';
import { BaseHandle } from '../../../base-handle';
import { useDataModelEditor } from '../../DataModelEditorProvider';
import { DataModelAddNodeHandle } from '../DataModelAddNodeHandle';
import {
  NodeCard,
  NodeCardContent,
  NodeCardHeader,
  NodeCardTitle,
} from '../common/NodeCard';

export type DataModelPopulateNode = Node<
  {
    base: EntityDef;
  },
  'populate'
>;

type AvailableRelation = {
  relatedEntity: EntityDef;
  relation: RelationDef<EntityDef, EntityDef>;
  relationType: 'to' | 'from';
};

export function isRelatedEndpoint(
  endpoint: RelationEndpoint<EntityDef>,
  entity: EntityDef,
) {
  return (
    endpoint.entity === entity.name && endpoint.namespace === entity.namespace
  );
}

export function collect(
  def: DataModelDef,
  entity: EntityDef,
): AvailableRelation[] {
  const entityMap = new Map<string, EntityDef>(
    def.entities.map(e => [makeEntityId(e), e]),
  );

  return def.relations
    .map(r => {
      if (isRelatedEndpoint(r.from, entity)) {
        const relatedEntity = entityMap.get(`${r.to.namespace}.${r.to.entity}`);
        if (!relatedEntity) return null;

        return { relatedEntity, relation: r, relationType: 'to' as const };
      }

      if (isRelatedEndpoint(r.to, entity)) {
        const relatedEntity = entityMap.get(
          `${r.from.namespace}.${r.from.entity}`,
        );
        if (!relatedEntity) return null;

        return { relatedEntity, relation: r, relationType: 'from' as const };
      }

      return null;
    })
    .filter(i => !!i);
}

export function makeEntityId(entity: EntityDef) {
  return `${entity.namespace}.${entity.name}`;
}

export function makeEntityLabel(entity: EntityDef) {
  return `${entity.namespace}.${entity.name}`;
}

export function DataModelPopulateNode(props: NodeProps<DataModelPopulateNode>) {
  const { def: dataModelDef } = useDataModelEditor();

  const [selectedRelations, setSelectedRelations] = useState<
    Record<string, boolean>
  >({});

  const [availableRelations, setAvailableRelations] = useState<
    AvailableRelation[]
  >(collect(dataModelDef, props.data.base));

  const setSelectedState = (relationId: string, state: boolean) => {
    setSelectedRelations(prev => ({ ...prev, [relationId]: state }));
  };

  return (
    <NodeCard selected={props.selected}>
      <BaseHandle type="target" position={Position.Left} id="transform" />

      <DataModelAddNodeHandle nodeId={props.id} nodeType={props.type} />

      <NodeCardHeader>
        <NodeCardTitle>
          Populate{' '}
          <span className="text-muted-foreground">{props.data.base.name}</span>
        </NodeCardTitle>
      </NodeCardHeader>

      <NodeCardContent className="p-0">
        <div
          className="flex flex-col divide-y border-t border-muted-foreground/10
            bg-muted text-xs text-secondary-foreground"
        >
          {availableRelations.map(r => (
            <Label
              htmlFor={r.relation.id}
              key={r.relation.id}
              className="flex items-center justify-between gap-2 px-4 py-1"
            >
              <Checkbox
                id={r.relation.id}
                name={r.relation.id}
                className="size-4"
                checked={selectedRelations[r.relation.id] ?? false}
                onCheckedChange={checked =>
                  setSelectedState(r.relation.id, checked === true)
                }
              />
              <div className="flex grow-1 items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm">
                    {makeEntityLabel(r.relatedEntity)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {r.relation.id}
                  </span>
                </div>
                <MultiplicityBadge mul={r.relation[r.relationType].mul} />
              </div>
            </Label>
          ))}
        </div>
      </NodeCardContent>
    </NodeCard>
  );
}

export function MultiplicityBadge({
  mul: multiplicity,
}: {
  mul: typeof RELATION_MULTIPLICITY.$type;
}) {
  if (multiplicity === RELATION_MULTIPLICITY.enum.ONE) {
    return <span className="text-xs text-muted-foreground">1</span>;
  }

  if (multiplicity === RELATION_MULTIPLICITY.enum.MANY) {
    return <span className="text-xs text-muted-foreground">*</span>;
  }
}
