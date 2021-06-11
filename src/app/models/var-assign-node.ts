import { Token } from './token';
import { ASTNode } from './ast-node';

export interface VarAssignNode extends ASTNode {
  token: Token,
  node: ASTNode // The root node of the expression being assigned.
}
