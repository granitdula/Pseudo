import { BinaryOpNode } from './../models/binary-op-node';
import { NumberNode } from './../models/number-node';
import { ASTNode } from '../models/ast-node';
import { Token } from '../models/token';
import { NUMBER, MULTIPLY, DIVIDE, PLUS, MINUS } from './token-type.constants';

/**
 * This Parser implements a recursive descent parser.
 */
export class Parser {

  private tokenIdx: number;
  private currentToken: Token;

  constructor(private tokens: Array<Token>) {
    this.tokenIdx = -1;
    this.advance();
  }

  private advance(): void {

    this.tokenIdx++;

    if (this.tokenIdx < this.tokens.length) {
      this.currentToken = this.tokens[this.tokenIdx];
    }
  }

  private binaryOperators(grammerFunc: string, ops: Set<string>): BinaryOpNode | NumberNode {
    let leftNode: BinaryOpNode | NumberNode;
    let rightNode: BinaryOpNode | NumberNode;

    if (grammerFunc === 'term') { leftNode = this.term(); }
    else { leftNode = this.factor(); }

    while (ops.has(this.currentToken.type)) {
      let opToken = this.currentToken;
      this.advance();

      if (grammerFunc === 'term') { rightNode = this.term(); }
      else { rightNode = this.factor(); }

      leftNode = {
        token: opToken,
        leftChild: leftNode,
        rightChild: rightNode
      };
    }

    return leftNode;
  }

  private factor(): NumberNode {

    let tok = this.currentToken;

    if (tok.type === NUMBER) {
      this.advance();
      let numberNode: NumberNode = {token: tok};
      return numberNode;
    }
  }

  private term(): BinaryOpNode | NumberNode {
    let operators: Set<string> = new Set([MULTIPLY, DIVIDE]);
    return this.binaryOperators('factor', operators);
  }

  private expr(): BinaryOpNode | NumberNode {
    let operators: Set<string> = new Set([PLUS, MINUS]);
    return this.binaryOperators('term', operators);
  }

  public parse(): ASTNode {
    let astNode: ASTNode = this.expr();
    return astNode;
  }
}
