import type { DataModelEntityNode } from './entity/DataModelEntityNode';
import type { DataModelMapNode } from './map/DataModelMapNode';
import type { DataModelPopulateNode } from './populate/DataModelPopulateNode';

export type DataModelNode =
  | DataModelEntityNode
  | DataModelPopulateNode
  | DataModelMapNode;
