import {
  BaseEdge,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  Position,
} from '@xyflow/react';
import { useMemo, useRef } from 'react';

import type { EntityDef, RelationDef } from '@easybread/data-model';

export type DataModelEntityEdge = Edge<
  { def: RelationDef<EntityDef, EntityDef> },
  'entity'
>;

export interface Point {
  x: number;
  y: number;
}

/** Cubic-Bézier midpoint (t = 0.5) */
export function bezierMidpoint(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point {
  // weights: 1/8, 3/8, 3/8, 1/8
  return {
    x: (p0.x + 3 * p1.x + 3 * p2.x + p3.x) / 8,
    y: (p0.y + 3 * p1.y + 3 * p2.y + p3.y) / 8,
  };
}

export function useSpecialEdgePath(
  props: EdgeProps<DataModelEntityEdge>,
  labelRef: React.RefObject<HTMLDivElement | null>,
) {
  const CURVATURE_FACTOR = 0.3;

  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

  return useMemo(() => {
    const curvature = Math.abs(targetY - sourceY) * CURVATURE_FACTOR;

    const m = `M ${sourceX} ${sourceY}`;
    const [dx1, dy1] =
      sourcePosition === Position.Right
        ? [sourceX + curvature, sourceY]
        : [sourceX - curvature, sourceY];

    const [dx2, dy2] =
      targetPosition === Position.Right
        ? [targetX + curvature, targetY]
        : [targetX - curvature, targetY];

    const path = `${m} C ${dx1} ${dy1} ${dx2} ${dy2} ${targetX} ${targetY}`;

    const labelPosition = bezierMidpoint(
      { x: sourceX, y: sourceY },
      { x: dx1, y: dy1 },
      { x: dx2, y: dy2 },
      { x: targetX, y: targetY },
    );

    const labelWidth = labelRef.current?.clientWidth ?? 0;
    const labelHeight = labelRef.current?.clientHeight ?? 0;

    const labelPositionWithOffset = {
      x: labelPosition.x - labelWidth / 2,
      y: labelPosition.y - labelHeight / 2,
    };

    return { path, labelPosition: labelPositionWithOffset };
  }, [
    targetY,
    sourceY,
    sourceX,
    sourcePosition,
    targetPosition,
    targetX,
    labelRef,
  ]);
}

export function DataModelEntityEdgeImpl(props: EdgeProps<DataModelEntityEdge>) {
  const { id, label, labelStyle, markerStart, markerEnd, interactionWidth } =
    props;

  const labelRef = useRef<HTMLDivElement>(null);

  const { path, labelPosition } = useSpecialEdgePath(props, labelRef);

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        label={label}
        labelStyle={labelStyle}
        markerEnd={markerEnd}
        markerStart={markerStart}
        interactionWidth={interactionWidth}
      />
      <EdgeLabelRenderer>
        <div
          ref={labelRef}
          className="pointer-events-auto absolute rounded-md border
            border-muted-foreground bg-muted px-1 py-0.5 text-xs
            text-muted-foreground shadow"
          style={{
            transform: `translate(${labelPosition.x}px, ${labelPosition.y}px)`,
          }}
        >
          {props.data?.def?.from?.fieldNames?.join(',')}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
