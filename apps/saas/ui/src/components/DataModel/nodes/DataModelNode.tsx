import type { Node } from '@xyflow/react';

import type { DataModelEntityNode } from './entity/DataModelEntityNode';
import type { DataModelMapNode } from './map/DataModelMapNode';
import type { DataModelPopulateNode } from './populate/DataModelPopulateNode';

export type DataModelNode =
  | DataModelEntityNode
  | DataModelPopulateNode
  | DataModelMapNode;

export function isNode(val: unknown): val is Node {
  return !!val && typeof val === 'object' && 'type' in val;
}

export function isEntityNode(node: unknown): node is DataModelEntityNode {
  return isNode(node) && node.type === 'entity';
}

export function isPopulateNode(node: unknown): node is DataModelPopulateNode {
  return isNode(node) && node.type === 'populate';
}

export function isMapNode(node: unknown): node is DataModelMapNode {
  return isNode(node) && node.type === 'map';
}
