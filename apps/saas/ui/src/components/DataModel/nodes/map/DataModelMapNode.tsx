import { type NodeProps, Position } from '@xyflow/react';
import { type Node } from '@xyflow/react';

import { Button } from '../../../../shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../shadcn/card';
import { BaseHandle } from '../../../base-handle';

export type DataModelMapNode = Node<Record<string, never>, 'map'>;

export function DataModelMapNode(_props: NodeProps<DataModelMapNode>) {
  return (
    <Card>
      <BaseHandle type="target" position={Position.Left} id="transform" />
      <BaseHandle type="source" position={Position.Right} id="transform" />
      <CardHeader>
        <CardTitle>Map</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Configure</Button>
      </CardContent>
    </Card>
  );
}
