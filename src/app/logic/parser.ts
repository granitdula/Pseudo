import { ParseResult } from './parse-result';
import { InvalidSyntaxError } from './invalid-syntax-error';
import { BinaryOpNode } from './../models/binary-op-node';
import { NumberNode } from './../models/number-node';
import { ASTNode } from '../models/ast-node';
import { Token } from '../models/token';
import { NUMBER, MULTIPLY, DIVIDE, PLUS, MINUS, L_BRACKET, R_BRACKET, EOF, POWER } from './token-type.constants';
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

  private advance(): Token {

    this.tokenIdx++;

    if (this.tokenIdx < this.tokens.length) {
      this.currentToken = this.tokens[this.tokenIdx];
    }

    return this.currentToken;
  }

  private binaryOperators(grammerFunc: string, ops: Set<string>,
                          otherGrammarFunc?: string): ParseResult {
    let parseResult = new ParseResult();
    let leftNode: ASTNode;
    let rightNode: ASTNode;

    if (otherGrammarFunc === undefined) { otherGrammarFunc = grammerFunc; }

    if (grammerFunc === 'term') { leftNode = parseResult.register(this.term()); }
    else if (grammerFunc === 'factor') { leftNode = parseResult.register(this.factor()); }
    else { leftNode = parseResult.register(this.atom()); }

    if (parseResult.getError() !== null) { return parseResult; }

    while (ops.has(this.currentToken.type)) {
      let opToken = this.currentToken;
      parseResult.register(this.advance());

      if (otherGrammarFunc === 'term') { rightNode = parseResult.register(this.term()); }
      else { rightNode = parseResult.register(this.factor()); }

      leftNode = {
        token: opToken,
        leftChild: leftNode,
        rightChild: rightNode
      };
    }

    return parseResult.success(leftNode);
  }

  private atom(): ParseResult {

    let parseResult = new ParseResult();
    let tok = this.currentToken;

    if (tok.type === NUMBER) {
      parseResult.register(this.advance());
      let numberNode: NumberNode = {token: tok};
      return parseResult.success(numberNode);
    }
    else if (tok.type === L_BRACKET) {
      parseResult.register(this.advance());
      let expr = parseResult.register(this.expr());

      if (parseResult.getError() !== null) { return parseResult; }

      if (this.currentToken.type === R_BRACKET) {
        parseResult.register(this.advance());
        return parseResult.success(expr);
      }
      else {
        const syntaxError = new InvalidSyntaxError(`missing ')'`, this.currentToken.positionStart,
                                                                  this.currentToken.positionEnd);
        return parseResult.failure(syntaxError);
      }
    }

    const syntaxError = new InvalidSyntaxError(`Expected a number, '+', '-' or '('`,
                                                this.currentToken.positionStart,
                                                this.currentToken.positionEnd);

    return parseResult.failure(syntaxError);
  }

  private power(): ParseResult {
    const operators: Set<string> = new Set([POWER]);
    return this.binaryOperators('atom', operators, 'factor');
  }

  private factor(): ParseResult {

    let parseResult = new ParseResult();
    let tok = this.currentToken;

    if (tok.type === PLUS || tok.type === MINUS) {
      parseResult.register(this.advance());
      let factor = parseResult.register(this.factor());

      if (parseResult.getError() !== null) { return parseResult; }

      const unaryOpNode: UnaryOpNode = {token: tok, node: factor};
      return parseResult.success(unaryOpNode);
    }

    return this.power();
  }

  private term(): ParseResult {
    let operators: Set<string> = new Set([MULTIPLY, DIVIDE]);
    return this.binaryOperators('factor', operators);
  }

  private expr(): ParseResult {
    let operators: Set<string> = new Set([PLUS, MINUS]);
    return this.binaryOperators('term', operators);
  }

  public parse(): ParseResult {
    let parseResult: ParseResult = this.expr();

    if (parseResult.getError() === null && this.currentToken.type !== EOF) {
      const node: ASTNode = parseResult.getNode();
      const syntaxError = new InvalidSyntaxError(`Expected '+', '-', '*' or '/'`,
                                                  node.token.positionStart,
                                                  node.token.positionEnd);
      return parseResult.failure(syntaxError);
    }

    return parseResult;
  }
}
