import {
  type BuiltInEdge,
  type ConnectionState,
  Position,
  useConnection,
  useNodeConnections,
  useReactFlow,
} from '@xyflow/react';
import { useCallback } from 'react';

import { ButtonHandle } from '../../button-handle';
import type { TransformType } from '../DataModelAddTransformButton/AddTransformNodeDropdown';
import { DataModelAddTransformButton } from '../DataModelAddTransformButton/DataModelAddTransformButton';

import type { DataModelNode } from './DataModelNode';

const inProgressSelector = (connection: ConnectionState) => {
  return connection.inProgress || connection.isValid;
};

export function nodeFactory(props: {
  transformType: TransformType;
  sourceNode: DataModelNode;
}): DataModelNode {
  const { transformType, sourceNode } = props;

  switch (props.transformType) {
    case 'transform-populate':
      if (sourceNode.type !== 'entity') {
        throw new Error('Source node is not an entity');
      }

      return {
        type: 'populate',
        id: `transform-${sourceNode.id}-${transformType}`,
        position: {
          y:
            sourceNode.position.y +
            (sourceNode.measured?.height ?? 0) / 2 -
            100,
          x: sourceNode.position.x + 600,
        },
        data: { base: sourceNode.data.def },
      };

    case 'transform-map':
      return {
        type: 'map',
        id: `transform-${sourceNode.id}-${transformType}`,
        position: {
          y:
            sourceNode.position.y +
            (sourceNode.measured?.height ?? 0) / 2 -
            100,
          x: sourceNode.position.x + 600,
        },
        data: {},
      };

    default:
      throw new Error(`Unknown transform type: ${transformType}`);
  }
}

export function DataModelAddNodeHandle({
  nodeId,
  nodeType,
}: {
  nodeId: string;
  nodeType: DataModelNode['type'];
}) {
  const connectionInProgress = useConnection(inProgressSelector);
  const connections = useNodeConnections({
    id: nodeId,
    handleType: 'source',
    handleId: 'transform',
  });

  const { getNode, addEdges, addNodes } = useReactFlow<
    DataModelNode,
    BuiltInEdge
  >();

  const onAdd = useCallback(
    (transform: TransformType) => {
      if (!transform || transform === 'none') return;

      const sourceNode = getNode(nodeId);
      if (!sourceNode) return;

      const newNode = nodeFactory({
        transformType: transform,
        sourceNode,
      });

      addNodes(newNode);
      addEdges({
        id: `edge-${sourceNode.id}-${newNode.id}`,
        source: sourceNode.id,
        sourceHandle: 'transform',
        target: newNode.id,
        targetHandle: 'transform',
        type: 'smoothstep',
        animated: true,
      });
    },

    [getNode, nodeId, addNodes, addEdges],
  );

  return (
    <ButtonHandle
      type="source"
      id="transform"
      position={Position.Right}
      showButton={!connectionInProgress && connections.length === 0}
    >
      <DataModelAddTransformButton parentNodeType={nodeType} onAdd={onAdd} />
    </ButtonHandle>
  );
}
