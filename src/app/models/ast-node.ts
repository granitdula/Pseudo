import { Token } from './token';

export interface ASTNode {
  token: Token,
  leftChild?: ASTNode,
  rightChild?: ASTNode
}
