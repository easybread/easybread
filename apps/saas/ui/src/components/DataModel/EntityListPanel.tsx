'use client';

import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import type { EntityDef } from '@easybread/data-model';

import { cn } from '../../lib/utils';
import { Button } from '../../shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';
import { ScrollArea } from '../../shadcn/scroll-area';

type EntityListPanelProps = {
  entities: EntityDef[];
  entityVisibility: Record<string, boolean>;
  onToggleEntityVisibility: (entityId: string) => void;
  getNodeId: (entityName: string, namespace?: string) => string;
};

export function EntityListPanel({
  entities,
  entityVisibility,
  onToggleEntityVisibility,
  getNodeId,
}: EntityListPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card
      className="absolute top-4 right-4 z-20 h-max w-64 gap-0 border-gray-600 bg-gray-800 py-0
        text-white shadow-xl"
    >
      <CardHeader className="flex items-center p-3">
        <CardTitle className="text-md grow font-semibold text-gray-100">
          Entities
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-gray-100"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand entity list' : 'Collapse entity list'}
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      <ScrollArea
        className={cn('transition-all duration-300', {
          'h-min': !collapsed,
          'h-0': collapsed,
        })}
      >
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-700">
            {entities.map(entity => {
              const entityId = getNodeId(entity.name, entity.namespace);
              const isVisible = entityVisibility[entityId] ?? true;

              return (
                <li
                  key={entityId}
                  className={`flex items-center justify-between p-2.5 text-xs transition-colors
                  hover:bg-gray-700 ${!isVisible ? 'opacity-60' : ''}`}
                >
                  <span
                    className={`truncate ${!isVisible ? 'text-gray-500 line-through' : 'text-gray-200'}`}
                  >
                    {entity.namespace
                      ? `${entity.namespace}.${entity.name}`
                      : entity.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-100"
                    onClick={() => onToggleEntityVisibility(entityId)}
                    aria-label={isVisible ? 'Hide entity' : 'Show entity'}
                  >
                    {isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
