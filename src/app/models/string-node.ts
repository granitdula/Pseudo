import { ASTNode } from './ast-node';
import { Token } from './token';

export interface StringNode extends ASTNode {
  nodeType: string,
  token: Token
}
