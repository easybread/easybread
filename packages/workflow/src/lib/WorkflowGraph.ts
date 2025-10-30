import type { NodeAny } from './domain/Node';

export class WorkflowGraph<TRoot extends NodeAny> {
  private readonly root: TRoot;

  constructor(root: TRoot) {
    this.root = root;
  }

  getRootNode() {
    return this.root;
  }

  getNode(id: string): NodeAny {
    const node = id.split('/').reduce<NodeAny | undefined>((node, segment) => {
      if (node) return node.getChild(segment);
    }, this.root);

    if (!node) {
      throw new Error(`Node with id ${id} not found`);
    }

    return node;
  }

  getParentNode(id: string): NodeAny | null {
    const parentId = id.split('/').slice(0, -1).join('/');
    return parentId ? this.getNode(parentId) : null;
  }
}
