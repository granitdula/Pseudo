import { Token } from './token';
import { ASTNode } from './ast-node';

export interface ForNode extends ASTNode {
  nodeType: string,
  token: Token,
  varNameToken: Token,
  startValueNode: ASTNode,
  endValueNode: ASTNode,
  stepValueNode: ASTNode,
  bodyNode: ASTNode
}
