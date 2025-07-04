'use client';

import { enumObject } from '@space-architects/util-enum';
import {
  Background,
  type Connection,
  Controls,
  type Edge,
  MarkerType,
  type OnSelectionChangeFunc,
  ReactFlow,
  addEdge,
  getConnectedEdges,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useOnSelectionChange,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDataModelEditor } from './DataModelEditorProvider';
import { DataModelEntityEdgeImpl } from './nodes/entity/DataModelEntityEdge';
import { DataModelEntityNode } from './nodes/entity/DataModelEntityNode';
import { DataModelMapNode } from './nodes/map/DataModelMapNode';
import { DataModelPopulateNode } from './nodes/populate/DataModelPopulateNode';

const getEntityNodeId = (entityName: string, namespace?: string): string => {
  return `${namespace ? `${namespace}.` : ''}${entityName}`;
};

const NODE_TYPES = {
  entity: DataModelEntityNode,
  populate: DataModelPopulateNode,
  map: DataModelMapNode,
} as const;

const NODE_TYPE_ENUM = enumObject(
  Object.keys(NODE_TYPES) as (keyof typeof NODE_TYPES)[],
);

const EDGE_TYPES = {
  entity: DataModelEntityEdgeImpl,
} as const;

const EDGE_TYPE_ENUM = enumObject(
  Object.keys(EDGE_TYPES) as (keyof typeof EDGE_TYPES)[],
);

const getLayoutedElements = (nodes: DataModelEntityNode[], edges: Edge[]) => {
  const gap = 10;

  let nextNodeY = 0;
  const newNodes = nodes.map(node => {
    const y = nextNodeY;
    nextNodeY += gap + (node.measured?.height ?? 0);
    return {
      ...node,
      position: { x: 0, y },
    };
  });

  return {
    nodes: newNodes,
    edges,
  };
};

export function DataModelEditor() {
  const { def } = useDataModelEditor();

  const nodesInitialized = useNodesInitialized();
  const { fitView } = useReactFlow();

  const [layouted, setLayouted] = useState(false);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes = new Map<string, DataModelEntityNode>();
    const edges: Edge[] = [];

    for (const entityDef of def.entities) {
      const nodeId = getEntityNodeId(entityDef.name, entityDef.namespace);
      nodes.set(nodeId, {
        id: nodeId,
        type: NODE_TYPE_ENUM.entity,
        data: {
          def: entityDef,
          edgesOutCount: 0,
          edgesInCount: 0,
        },
        position: { x: 0, y: 0 },
      });
    }

    for (const rel of def.relations) {
      const edge: Edge = {
        id: rel.id,
        animated: true,
        sourceHandle: 'relation',
        targetHandle: 'relation',
        source: getEntityNodeId(rel.from.entity, rel.from.namespace),
        target: getEntityNodeId(rel.to.entity, rel.to.namespace),
        type: EDGE_TYPE_ENUM.entity,
        data: { def: rel },
      };
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      nodes.get(edge.source)!.data.edgesOutCount++;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      nodes.get(edge.target)!.data.edgesInCount++;
      edges.push(edge);
    }

    return {
      nodes: Array.from(nodes.values())
        .sort(
          (a, b) =>
            b.data.edgesInCount +
            b.data.edgesOutCount -
            (a.data.edgesInCount + a.data.edgesOutCount),
        )
        .map(n => ({
          ...n,
          position: { x: 0, y: 0 },
        })),
      edges,
    };
  }, [def]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds: Edge[]) => {
        return addEdge(
          {
            ...params,
            type: EDGE_TYPE_ENUM.entity,
            markerEnd: {
              type: MarkerType.Arrow,
              width: 16,
              height: 16,
            },
          },
          eds,
        );
      }),
    [setEdges],
  );

  const layoutNodes = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    fitView();
    setLayouted(true);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  useEffect(() => {
    if (nodesInitialized && !layouted) layoutNodes();
  }, [nodesInitialized, layoutNodes, layouted]);

  const onSelect = useCallback<OnSelectionChangeFunc>(
    params => {
      const connections = getConnectedEdges(params.nodes, edges);
      const edgeIds = connections.map(c => c.id);
      setEdges(eds =>
        eds.map(e => {
          if (edgeIds.includes(e.id)) {
            return {
              ...e,
              selected: true,
            };
          }
          return e;
        }),
      );
    },
    [edges, setEdges],
  );

  useOnSelectionChange({ onChange: onSelect });

  return (
    <div
      className="relative flex flex-1 flex-col rounded-xl
        bg-data-model-background"
    >
      <ReactFlow
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        panOnScroll
        selectionOnDrag
        fitView
      >
        <Background color="var(--muted-foreground)" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
