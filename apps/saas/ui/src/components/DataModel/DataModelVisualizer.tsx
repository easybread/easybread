'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  MarkerType,
  type Node,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import type { DataModelDef, EntityDef } from '@easybread/data-model';

import {
  ColumnSteppedEdge,
  type ColumnSteppedEdgeData,
} from './ColumnSteppedEdge';
import { EntityListPanel } from './EntityListPanel';
// Updated path
import { EntityNode, type EntityNodeData } from './EntityNode';

const nodeTypes = { entityNode: EntityNode };
const edgeTypes = { columnStepped: ColumnSteppedEdge };

const getNodeId = (entityName: string, namespace?: string): string => {
  return namespace ? `${namespace}.${entityName}` : entityName;
};

const HEADER_HEIGHT = 36;

const estimateNodeHeight = (
  entityDef: EntityDef,
  isCollapsed: boolean,
): number => {
  if (isCollapsed) {
    return HEADER_HEIGHT;
  }

  let fieldsHeight = 0;
  const fieldBaseLineHeight = 20;
  const fieldVerticalPadding = 6 * 2;
  const fieldBorderHeight = 1;

  const numFields = Object.keys(entityDef.fields).length;
  if (numFields > 0) {
    fieldsHeight =
      numFields *
      (fieldBaseLineHeight + fieldVerticalPadding + fieldBorderHeight);
    fieldsHeight -= fieldBorderHeight;
  }
  return HEADER_HEIGHT + fieldsHeight;
};

export function DataModelVisualizer({
  dataModel,
}: {
  dataModel: DataModelDef;
}) {
  const [entityVisibility, setEntityVisibility] = useState<
    Record<string, boolean>
  >(() => {
    const initialVisibility: Record<string, boolean> = {};
    dataModel.entities.forEach(entity => {
      initialVisibility[getNodeId(entity.name, entity.namespace)] = true;
    });
    return initialVisibility;
  });

  const [entityCollapsedState, setEntityCollapsedState] = useState<
    Record<string, boolean>
  >(() => {
    const initialCollapsed: Record<string, boolean> = {};
    dataModel.entities.forEach(entity => {
      initialCollapsed[getNodeId(entity.name, entity.namespace)] = false;
    });
    return initialCollapsed;
  });

  const handleToggleEntityVisibility = (entityId: string) => {
    setEntityVisibility(prev => ({ ...prev, [entityId]: !prev[entityId] }));
  };

  const handleToggleEntityCollapse = (entityId: string) => {
    setEntityCollapsedState(prev => ({
      ...prev,
      [entityId]: !(prev[entityId] ?? false),
    }));
  };

  const { nodes: processedNodes, edges: processedEdges } = useMemo(() => {
    if (!dataModel?.entities) {
      return { nodes: [], edges: [] };
    }

    const allPotentialNodes: Node<EntityNodeData>[] = [];
    const verticalPaddingBetweenNodes = 30;
    const xPosition = 120;
    let currentY = 0;

    dataModel.entities.forEach(entity => {
      const entityId = getNodeId(entity.name, entity.namespace);
      const isCollapsed = entityCollapsedState[entityId] ?? false;
      const estimatedHeight = estimateNodeHeight(entity, isCollapsed);

      allPotentialNodes.push({
        id: entityId,
        type: 'entityNode',
        position: { x: xPosition, y: currentY },
        data: {
          entityDef: entity,
          isCollapsed: isCollapsed,
          onToggleCollapse: handleToggleEntityCollapse,
          entityId: entityId,
        },
      });
      currentY += estimatedHeight + verticalPaddingBetweenNodes;
    });

    const visibleNodes = allPotentialNodes.filter(
      node => entityVisibility[node.id] ?? true,
    );

    const allPotentialEdges: Edge<ColumnSteppedEdgeData>[] = [];
    const horizontalStepOutBase = 50;
    const verticalChannelSpacing = 20;
    const edgeColor = '#a0aec0';
    const mainChannelKey = 'main_channel';
    const channelEdgeCounts: Record<
      string,
      { total: number; currentIndex: number }
    > = {
      [mainChannelKey]: { total: 0, currentIndex: 0 },
    };
    dataModel.relations.forEach(() => {
      channelEdgeCounts[mainChannelKey].total++;
    });

    dataModel.relations.forEach(relation => {
      const sourceNodeId = getNodeId(
        relation.from.entity,
        relation.from.namespace,
      );
      const targetNodeId = getNodeId(relation.to.entity, relation.to.namespace);
      const sourceHandle = relation.from.fieldNames[0];
      const targetHandle = relation.to.fieldNames[0];

      if (!sourceHandle || !targetHandle) return;

      const edgeIndexInChannel = channelEdgeCounts[mainChannelKey].currentIndex;
      channelEdgeCounts[mainChannelKey].currentIndex++;
      const progressiveVerticalChannelOffset =
        edgeIndexInChannel * verticalChannelSpacing;

      allPotentialEdges.push({
        id: relation.id,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: sourceHandle,
        targetHandle: targetHandle,
        type: 'columnStepped',
        data: {
          horizontalStepOut: horizontalStepOutBase,
          verticalChannelOffset: progressiveVerticalChannelOffset,
          fromMul: relation.from.mul,
          toMul: relation.to.mul,
          onDeleteAction: relation.onDelete,
          onUpdateAction: relation.onUpdate,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: edgeColor,
        },
        style: { stroke: edgeColor, strokeWidth: 2 },
      });
    });

    const visibleEdges = allPotentialEdges.filter(
      edge =>
        (entityVisibility[edge.source] ?? true) &&
        (entityVisibility[edge.target] ?? true),
    );

    return { nodes: visibleNodes, edges: visibleEdges };
  }, [dataModel, entityVisibility, entityCollapsedState]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [processedNodes, processedEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="relative flex flex-1 flex-col rounded-xl bg-background">
      <EntityListPanel
        entities={dataModel.entities}
        entityVisibility={entityVisibility}
        onToggleEntityVisibility={handleToggleEntityVisibility}
        getNodeId={getNodeId}
      />
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          attributionPosition="bottom-left"
        >
          <Controls />
          <Background
            color="var(--muted-foreground)"
            gap={24}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
