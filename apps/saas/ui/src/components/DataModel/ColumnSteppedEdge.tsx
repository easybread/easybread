'use client';

import { useState } from 'react';
import { EdgeLabelRenderer, type EdgeProps } from 'reactflow';

import type {
  RELATION_ACTION,
  RELATION_MULTIPLICITY,
} from '@easybread/data-model';

// Updated path

export type ColumnSteppedEdgeData = {
  horizontalStepOut?: number;
  verticalChannelOffset?: number;
  fromMul: typeof RELATION_MULTIPLICITY.$type;
  toMul: typeof RELATION_MULTIPLICITY.$type;
  onDeleteAction: typeof RELATION_ACTION.$type | null;
  onUpdateAction: typeof RELATION_ACTION.$type | null;
};

function getMultiplicitySymbol(
  multiplicity: typeof RELATION_MULTIPLICITY.$type,
): string {
  if (multiplicity === 'ONE') return '1';
  if (multiplicity === 'MANY') return '*';
  return '';
}

function getSteppedPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  horizontalStepOut = 30,
  verticalChannelOffset = 0,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  horizontalStepOut?: number;
  verticalChannelOffset?: number;
}): [string, number, number, number, number, number, number] {
  const initialStepOutX = sourceX + horizontalStepOut;
  const mainVerticalLineX = initialStepOutX + verticalChannelOffset;
  const path = `M ${sourceX},${sourceY} L ${initialStepOutX},${sourceY} L ${mainVerticalLineX},${sourceY} L ${mainVerticalLineX},${targetY} L ${initialStepOutX},${targetY} L ${targetX},${targetY}`;

  const midPointY = (sourceY + targetY) / 2;
  const sourceMulLabelX = sourceX + 10;
  const sourceMulLabelY = sourceY;
  const targetMulLabelX = targetX - 10;
  const targetMulLabelY = targetY;

  return [
    path,
    mainVerticalLineX,
    midPointY,
    sourceMulLabelX,
    sourceMulLabelY,
    targetMulLabelX,
    targetMulLabelY,
  ];
}

export function ColumnSteppedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
  style,
}: EdgeProps<ColumnSteppedEdgeData>) {
  const [isHovered, setIsHovered] = useState(false);

  if (!data) return null;

  const [
    edgePath,
    actionsLabelX,
    actionsLabelY,
    sourceMulLabelX,
    sourceMulLabelY,
    targetMulLabelX,
    targetMulLabelY,
  ] = getSteppedPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    horizontalStepOut: data.horizontalStepOut,
    verticalChannelOffset: data.verticalChannelOffset,
  });

  const sourceMultiplicity = getMultiplicitySymbol(data.fromMul);
  const targetMultiplicity = getMultiplicitySymbol(data.toMul);
  const hasActions = data.onDeleteAction || data.onUpdateAction;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        onMouseEnter={() => hasActions && setIsHovered(true)}
        onMouseLeave={() => hasActions && setIsHovered(false)}
      />
      {sourceMultiplicity && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${sourceMulLabelX}px,${sourceMulLabelY}px)`,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#cbd5e0',
              pointerEvents: 'none',
              padding: '0 2px',
            }}
            className="nodrag nopan"
          >
            {sourceMultiplicity}
          </div>
        </EdgeLabelRenderer>
      )}
      {targetMultiplicity && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${targetMulLabelX}px,${targetMulLabelY}px)`,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#cbd5e0',
              pointerEvents: 'none',
              padding: '0 2px',
            }}
            className="nodrag nopan"
          >
            {targetMultiplicity}
          </div>
        </EdgeLabelRenderer>
      )}
      {isHovered && hasActions && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${actionsLabelX}px,${actionsLabelY}px)`,
              fontSize: 10,
              background: '#2d3748',
              padding: '3px 6px',
              borderRadius: 3,
              color: '#e2e8f0',
              pointerEvents: 'all',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              whiteSpace: 'pre-line',
            }}
            className="nodrag nopan"
          >
            {data.onDeleteAction && `onDelete: ${data.onDeleteAction}`}
            {data.onDeleteAction && data.onUpdateAction && '\n'}
            {data.onUpdateAction && `onUpdate: ${data.onUpdateAction}`}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
