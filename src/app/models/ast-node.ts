import { InvalidSyntaxError } from './../logic/invalid-syntax-error';
import { Token } from './token';
import { NumberNode } from './number-node';

export interface ASTNode {
  token: Token,
  leftChild?: ASTNode | InvalidSyntaxError,
  rightChild?: ASTNode | InvalidSyntaxError,
  node?: ASTNode | InvalidSyntaxError // Some nodes have single nodes such as NumberNode.
}
