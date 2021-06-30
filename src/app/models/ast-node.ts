import { InvalidSyntaxError } from './../logic/invalid-syntax-error';
import { Token } from './token';

export interface ASTNode {
  nodeType: string,
  token: Token,
  leftChild?: ASTNode | InvalidSyntaxError,
  rightChild?: ASTNode | InvalidSyntaxError,
  node?: ASTNode | InvalidSyntaxError // Some nodes have single nodes such as NumberNode.
  cases?: Array<[ASTNode, ASTNode]>,
  elseCase?: ASTNode,
  varNameToken?: Token,
  startValueNode?: ASTNode,
  endValueNode?: ASTNode,
  stepValueNode?: ASTNode,
  conditionNode?: ASTNode,
  bodyNode?: ASTNode,
  argNameTokens?: Token[],
  nodeToCall?: ASTNode,
  argNodes?: ASTNode[]
}
