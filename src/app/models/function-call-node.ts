import { ASTNode } from './ast-node';
import { Token } from './token';

export interface FunctionCallNode extends ASTNode {
  nodeType: string,
  token: Token,
  nodeToCall: ASTNode,
  argNodes: ASTNode[]
}
