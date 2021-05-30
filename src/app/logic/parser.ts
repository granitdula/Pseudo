import { InvalidSyntaxError } from './invalid-syntax-error';
import { BinaryOpNode } from './../models/binary-op-node';
import { NumberNode } from './../models/number-node';
import { ASTNode } from '../models/ast-node';
import { Token } from '../models/token';
import { NUMBER, MULTIPLY, DIVIDE, PLUS, MINUS, L_BRACKET, R_BRACKET } from './token-type.constants';
import { UnaryOpNode } from '../models/unary-op-node';

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

  private binaryOperators(grammerFunc: string, ops: Set<string>): ASTNode | InvalidSyntaxError {
    let leftNode: ASTNode | InvalidSyntaxError;
    let rightNode: ASTNode | InvalidSyntaxError;

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

  private factor(): ASTNode | InvalidSyntaxError {

    let tok = this.currentToken;

    if (tok.type === PLUS || tok.type === MINUS) {
      this.advance();
      let factor = this.factor();

      if (!(factor instanceof InvalidSyntaxError)) {
        const unaryOpNode: UnaryOpNode = {token: tok, node: factor};
        return unaryOpNode;
      }
    }
    else if (tok.type === NUMBER) {
      this.advance();
      let numberNode: NumberNode = {token: tok};
      return numberNode;
    }
    else if (tok.type === L_BRACKET) {
      this.advance();
      let expr = this.expr();

      if (this.currentToken.type === R_BRACKET) {
        this.advance();
        return expr;
      }
      else {
        const syntaxError = new InvalidSyntaxError(`missing ')'`);
        return syntaxError;
      }
    }
  }

  private term(): ASTNode | InvalidSyntaxError {
    let operators: Set<string> = new Set([MULTIPLY, DIVIDE]);
    return this.binaryOperators('factor', operators);
  }

  private expr(): ASTNode | InvalidSyntaxError {
    let operators: Set<string> = new Set([PLUS, MINUS]);
    return this.binaryOperators('term', operators);
  }

  public parse(): ASTNode | InvalidSyntaxError {
    let astNode: ASTNode | InvalidSyntaxError = this.expr();
    return astNode;
  }
}
