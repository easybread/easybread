'use client';

// Updated path
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';

import type { EntityDef } from '@easybread/data-model';

import { Button } from '../../shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';

import { EntityNodeField } from './EntityNodeField';

export type EntityNodeData = {
  entityDef: EntityDef;
  isCollapsed: boolean;
  onToggleCollapse: (entityId: string) => void;
  entityId: string;
};

const NODE_HEADER_HEIGHT = 36;
const FIELD_ROW_CONTENT_HEIGHT = 20;
const FIELD_ROW_VERTICAL_PADDING = 6 * 2;
const FIELD_ROW_BORDER_HEIGHT = 1;
const EFFECTIVE_FIELD_ROW_HEIGHT =
  FIELD_ROW_CONTENT_HEIGHT +
  FIELD_ROW_VERTICAL_PADDING +
  FIELD_ROW_BORDER_HEIGHT;

export function EntityNode({ data }: NodeProps<EntityNodeData>) {
  const { entityDef, isCollapsed, onToggleCollapse, entityId } = data;
  const entityTitle = entityDef.namespace
    ? `${entityDef.namespace}.${entityDef.name}`
    : entityDef.name;

  return (
    <Card
      className="relative w-72 gap-0 rounded-md border border-gray-600 bg-gray-800 py-0
        text-white shadow-md"
    >
      <CardHeader
        className="flex h-[36px] flex-row items-center justify-between space-y-0 rounded-t-md
          bg-gray-700 px-2 py-0"
      >
        <CardTitle className="text-sm font-semibold text-gray-100">
          {entityTitle}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="flex h-6 w-6 items-center justify-center space-y-0 p-0 text-gray-400
            hover:text-gray-100"
          onClick={() => onToggleCollapse(entityId)}
          aria-label={isCollapsed ? 'Expand entity' : 'Collapse entity'}
        >
          {isCollapsed ? (
            <ChevronDown className="m-0 h-4 w-4" />
          ) : (
            <ChevronUp className="m-0 h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-700">
            {Object.entries(entityDef.fields).map(([fieldName, fieldDef]) => (
              <EntityNodeField
                key={fieldName}
                fieldName={fieldName}
                fieldDef={fieldDef}
              />
            ))}
          </ul>
        </CardContent>
      )}
      {Object.entries(entityDef.fields).map(([fieldName], index) => {
        const handleTopPosition = isCollapsed
          ? NODE_HEADER_HEIGHT / 2
          : NODE_HEADER_HEIGHT +
            index * EFFECTIVE_FIELD_ROW_HEIGHT +
            EFFECTIVE_FIELD_ROW_HEIGHT / 2 -
            FIELD_ROW_BORDER_HEIGHT / 2;

        return (
          <React.Fragment key={`handles-${fieldName}`}>
            <Handle
              type="target"
              position={Position.Right}
              id={fieldName}
              className="!h-2.5 !w-2.5 !bg-sky-500/20"
              style={{
                top: `${handleTopPosition}px`,
                right: '-5px',
                position: 'absolute',
                zIndex: 10,
              }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id={fieldName}
              className="!h-2.5 !w-2.5 !bg-sky-500/20"
              style={{
                top: `${handleTopPosition}px`,
                right: '-5px',
                position: 'absolute',
                zIndex: 10,
              }}
            />
          </React.Fragment>
        );
      })}
    </Card>
  );
}
