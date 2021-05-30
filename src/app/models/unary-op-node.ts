import { InvalidSyntaxError } from './../logic/invalid-syntax-error';
import { ASTNode } from './ast-node';
import { Token } from './token';

export interface UnaryOpNode extends ASTNode {
  token: Token,
  node: ASTNode | InvalidSyntaxError
}
