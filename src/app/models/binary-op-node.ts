import { InvalidSyntaxError } from './../logic/invalid-syntax-error';
import { ASTNode } from './ast-node';
import { Token } from './token';

export interface BinaryOpNode extends ASTNode {
  nodeType: string,
  token: Token,
  leftChild: ASTNode | InvalidSyntaxError,
  rightChild: ASTNode | InvalidSyntaxError
}
