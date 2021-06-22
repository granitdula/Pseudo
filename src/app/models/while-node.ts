import { Token } from './token';
import { ASTNode } from './ast-node';

export interface WhileNode extends ASTNode {
  nodeType: string,
  token: Token,
  conditionNode: ASTNode,
  bodyNode: ASTNode
}
