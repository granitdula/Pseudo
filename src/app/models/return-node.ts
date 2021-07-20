import { ASTNode } from './ast-node';
import { Token } from './token';

export interface ReturnNode extends ASTNode {
  nodeType: string,
  token: Token,
  nodeToReturn: ASTNode
}
