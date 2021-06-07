import { ASTNode } from './ast-node';
import { Token } from './token';

export interface NumberNode extends ASTNode {
  token: Token
}
