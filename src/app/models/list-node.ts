import { Token } from './token';
import { ASTNode } from './ast-node';

export interface ListNode extends ASTNode {
  nodeType: string,
  token: Token,
  elementNodes: ASTNode[]
}
