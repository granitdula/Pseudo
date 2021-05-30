import { ASTNode } from './ast-node';
import { Token } from './token';

export interface BinaryOpNode extends ASTNode {
  token: Token,
  leftChild: ASTNode,
  rightChild: ASTNode
}
