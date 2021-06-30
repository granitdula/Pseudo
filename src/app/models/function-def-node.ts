import { ASTNode } from './ast-node';
import { Token } from './token';

export interface FunctionDefNode extends ASTNode {
  nodeType: string,
  token: Token,
  varNameToken: Token,
  argNameTokens: Token[],
  bodyNode: ASTNode
}
