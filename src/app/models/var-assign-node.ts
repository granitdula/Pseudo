import { Token } from './token';
import { ASTNode } from './ast-node';

export interface VarAssignNode extends ASTNode {
  nodeType: string,
  token: Token,
  node: ASTNode // The root node of the expression being assigned.
}
