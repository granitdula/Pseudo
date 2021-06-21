import { Token } from './token';
import { ASTNode } from './ast-node';

export interface IfNode extends ASTNode {
  nodeType: string,
  token: Token,
  cases: Array<[ASTNode, ASTNode]>,
  elseCase: ASTNode
}
