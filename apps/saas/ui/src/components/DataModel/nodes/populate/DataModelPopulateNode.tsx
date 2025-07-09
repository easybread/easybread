import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';

import { EntityDef } from '@easybread/data-model';

import { BaseHandle } from '../../../base-handle';
import { DataModelAddNodeHandle } from '../DataModelAddNodeHandle';
import { DataModelNode } from '../DataModelNode';
import {
  NodeCard,
  NodeCardContent,
  NodeCardHeader,
  NodeCardTitle,
} from '../common/NodeCard';

import { DataModelPopulateNodeRelationsList } from './DataModelPopulateNodeRelationList';
import type { RelationToPopulate } from './types';
import {
  updateRelationsToPopulate,
  useCollectRelationsToPopulate,
} from './utils';

export type DataModelPopulateNode = Node<
  {
    base: EntityDef;
    relationIds: string[];
  },
  'populate'
>;

export function DataModelPopulateNode(props: NodeProps<DataModelPopulateNode>) {
  const { updateNodeData } = useReactFlow<DataModelNode>();

  const collectRelationsToPopulate = useCollectRelationsToPopulate();

  const [availableRelations, setAvailableRelations] = useState<
    RelationToPopulate[]
  >(collectRelationsToPopulate(props.data.base));

  const [selectedRelations, setSelectedRelations] = useState<
    Record<string, boolean>
  >({});

  const setSelectedState = useCallback(
    (relationId: string, state: boolean) => {
      setSelectedRelations(prev => {
        if (state) {
          return { ...prev, [relationId]: state };
        }

        return Object.fromEntries(
          Object.entries(prev).filter(([id]) => !id.startsWith(relationId)),
        );
      });
      setAvailableRelations(prev =>
        updateRelationsToPopulate(
          prev,
          relationId,
          state,
          collectRelationsToPopulate,
        ),
      );
    },
    [collectRelationsToPopulate],
  );

  useEffect(() => {
    updateNodeData(props.id, {
      relationIds: Object.entries(selectedRelations)
        .filter(([_, isSelected]) => isSelected)
        .map(([path]) => path),
    });
  }, [props.id, selectedRelations, updateNodeData]);

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
        <DataModelPopulateNodeRelationsList
          availableRelations={availableRelations}
          selectedRelations={selectedRelations}
          setSelectedState={setSelectedState}
        />
      </NodeCardContent>
    </NodeCard>
  );
}
