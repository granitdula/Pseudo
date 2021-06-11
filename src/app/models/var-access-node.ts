import { ASTNode } from './ast-node';
import { Token } from './token';

export interface VarAccessNode extends ASTNode{
  token: Token
}
