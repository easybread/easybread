import {
  type NodeProps,
  Position,
  useNodeConnections,
  useNodesData,
} from '@xyflow/react';
import { type Node } from '@xyflow/react';
import { Fragment, useMemo } from 'react';

import { BaseHandle } from '../../../base-handle';
import { useDataModelEditor } from '../../DataModelEditorProvider';
import { makeEntityId } from '../../utils';
import { DataModelAddNodeHandle } from '../DataModelAddNodeHandle';
import {
  type DataModelNode,
  isEntityNode,
  isPopulateNode,
} from '../DataModelNode';
import {
  NodeCardContent,
  NodeCardHeader,
  NodeCardTitle,
} from '../common/NodeCard';
import { NodeCard } from '../common/NodeCard';
import { DataModelEntityNodeField } from '../entity/DataModelEntityNodeField';

export type DataModelMapNode = Node<Record<string, never>, 'map'>;

export function DataModelMapNode(props: NodeProps<DataModelMapNode>) {
  const { getRelatedEntity } = useDataModelEditor();

  const connections = useNodeConnections({
    handleType: 'target',
    handleId: 'transform',
  });

  const connectionsData = useNodesData<DataModelNode>(
    connections.map(c => c.source),
  );

  const inputDefs = useMemo(() => {
    return connectionsData
      .flatMap(d => {
        if (isEntityNode(d)) return d.data.def;

        if (isPopulateNode(d)) {
          return [
            d.data.base,
            ...d.data.relationIds.map(id =>
              getRelatedEntity(makeEntityId(d.data.base), id),
            ),
          ];
        }

        return null;
      })
      .filter(i => !!i);
  }, [connectionsData, getRelatedEntity]);

  return (
    <NodeCard selected={props.selected}>
      <BaseHandle type="target" position={Position.Left} id="transform" />
      <DataModelAddNodeHandle nodeId={props.id} nodeType={props.type} />

      <NodeCardHeader>
        <NodeCardTitle>Map</NodeCardTitle>
      </NodeCardHeader>

      <NodeCardContent className="p-0">
        {inputDefs.map(def => (
          <Fragment key={makeEntityId(def)}>
            <div
              className="bg-neutral-200/90 px-4 py-2 text-xs
                text-muted-foreground"
            >
              {makeEntityId(def)}
            </div>
            <ul
              className="flex flex-col divide-y border-t
                border-muted-foreground/10 bg-muted"
            >
              {Object.entries(def.fields).map(([key, field]) => (
                <DataModelEntityNodeField
                  key={key}
                  fieldName={key}
                  fieldDef={field}
                />
              ))}
            </ul>
          </Fragment>
        ))}
      </NodeCardContent>
    </NodeCard>
  );
}

export function DataModelMapNodeFieldList() {
  return <div>{fieldName}</div>;
}
