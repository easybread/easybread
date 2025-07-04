import { type Node, type NodeProps, Position } from '@xyflow/react';

import type { EntityDef } from '@easybread/data-model';

import { BaseHandle } from '../../../base-handle';
import { DataModelAddNodeHandle } from '../DataModelAddNodeHandle';
import {
  NodeCard,
  NodeCardContent,
  NodeCardHeader,
  NodeCardTitle,
} from '../common/NodeCard';

import { DataModelEntityNodeField } from './DataModelEntityNodeField';

export type DataModelEntityNode = Node<
  {
    def: EntityDef;
    edgesOutCount: number;
    edgesInCount: number;
  },
  'entity'
>;

export function DataModelEntityNode({
  id,
  data,
  selected,
  type,
}: NodeProps<DataModelEntityNode>) {
  return (
    <NodeCard selected={selected}>
      <BaseHandle type="source" position={Position.Left} id="relation" />
      <BaseHandle type="target" position={Position.Left} id="relation" />

      <DataModelAddNodeHandle nodeId={id} nodeType={type} />

      <BaseHandle type="source" position={Position.Right} id="transform" />

      <NodeCardHeader>
        <NodeCardTitle>
          <span className="text-muted-foreground/50">
            {data.def.namespace}.
          </span>
          {data.def.name}
        </NodeCardTitle>
      </NodeCardHeader>

      <NodeCardContent className="p-0">
        <ul
          className="flex flex-col divide-y border-t border-muted-foreground/10
            bg-muted"
        >
          {Object.entries(data.def.fields).map(([key, field]) => (
            <DataModelEntityNodeField
              key={key}
              fieldName={key}
              fieldDef={field}
            />
          ))}
        </ul>
      </NodeCardContent>
    </NodeCard>
  );
}
