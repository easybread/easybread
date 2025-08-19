import type { NodeAny } from './domain/Node';

export class WorkflowGraph<TRoot extends NodeAny> {
  private readonly root: TRoot;

  constructor(root: TRoot) {
    this.root = root;
  }

  getNode(id: string): NodeAny {
    const node = id.split('/').reduce<NodeAny | undefined>((node, segment) => {
      if (node) return node.getDirectChild(segment);
    }, this.root);

    if (!node) {
      throw new Error(`Node with id ${id} not found`);
    }

    return node;
  }
}
