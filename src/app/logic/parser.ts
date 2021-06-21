import { IfNode } from './../models/if-node';
import { VarAccessNode } from './../models/var-access-node';
import { VarAssignNode } from './../models/var-assign-node';
import { ParseResult } from './parse-result';
import { InvalidSyntaxError } from './invalid-syntax-error';
import { BinaryOpNode } from './../models/binary-op-node';
import { NumberNode } from './../models/number-node';
import { ASTNode } from '../models/ast-node';
import { Token } from '../models/token';
import * as TokenTypes from '../constants/token-type.constants';
import * as NodeTypes from '../constants/node-type.constants';
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

    switch (grammerFunc) {
      case 'term':
        leftNode = parseResult.register(this.term());
        break;
      case 'factor':
        leftNode = parseResult.register(this.factor());
        break;
      case 'atom':
        leftNode = parseResult.register(this.atom());
        break;
      case 'comparisonExpr':
        leftNode = parseResult.register(this.comparisonExpr());
        break;
      default:
        leftNode = parseResult.register(this.arithmeticExpr());
        break;
    }

    if (parseResult.getError() !== null) { return parseResult; }

    while (ops.has(this.currentToken.type) || (this.currentToken.type === TokenTypes.KEYWORD &&
          (this.currentToken.value === 'AND' || this.currentToken.value === 'OR'))) {
      let opToken = this.currentToken;
      parseResult.registerAdvancement();
      this.advance();

      if (otherGrammarFunc === 'term') { rightNode = parseResult.register(this.term()); }
      else if (otherGrammarFunc === 'arithmeticExpr') {
        rightNode = parseResult.register(this.arithmeticExpr());
      }
      else if (otherGrammarFunc === 'comparisonExpr') {
        rightNode = parseResult.register(this.comparisonExpr());
      }
      else { rightNode = parseResult.register(this.factor()); }

      leftNode = {
        nodeType: NodeTypes.BINARYOP,
        token: opToken,
        leftChild: leftNode,
        rightChild: rightNode
      };
    }

    return parseResult.success(leftNode);
  }

  private ifExpr(): ParseResult {
    let parseResult = new ParseResult();
    const cases: Array<[ASTNode, ASTNode]> = [];
    let elseCase: ASTNode = null;
    const ifToken: Token = this.currentToken;

    parseResult.registerAdvancement();
    this.advance();

    const condition: ASTNode = parseResult.register(this.expr());
    if (parseResult.getError() !== null) { return parseResult; }

    if (!(this.currentToken.type === TokenTypes.KEYWORD && this.currentToken.value === 'then')) {
      const syntaxError = new InvalidSyntaxError(`Expected 'then' keyword`,
                                                  this.currentToken.positionStart,
                                                  this.currentToken.positionEnd);
      return parseResult.failure(syntaxError);
    }

    parseResult.registerAdvancement();
    this.advance();

    const expr = parseResult.register(this.expr());
    if (parseResult.getError() !== null) { return parseResult; }

    cases.push([condition, expr]);

    while (this.currentToken.type === TokenTypes.KEYWORD && this.currentToken.value === 'elif') {
      parseResult.registerAdvancement();
      this.advance();

      const condition: ASTNode = parseResult.register(this.expr());
      if (parseResult.getError() !== null) { return parseResult; }

      if (!(this.currentToken.type === TokenTypes.KEYWORD &&
          this.currentToken.value === 'then')) {
        const syntaxError = new InvalidSyntaxError(`Expected 'then' keyword`,
                                                   this.currentToken.positionStart,
                                                   this.currentToken.positionEnd);
        return parseResult.failure(syntaxError);
      }

      parseResult.registerAdvancement();
      this.advance();

      const expr = parseResult.register(this.expr());
      if (parseResult.getError() !== null) { return parseResult; }

      cases.push([condition, expr]);
    }

    if (this.currentToken.type === TokenTypes.KEYWORD && this.currentToken.value === 'else') {
      parseResult.registerAdvancement();
      this.advance();

      elseCase = parseResult.register(this.expr());
      if (parseResult.getError() !== null) { return parseResult; }
    }

    if (!(this.currentToken.type === TokenTypes.KEYWORD && this.currentToken.value === 'end')) {
      const syntaxError = new InvalidSyntaxError(`Expected 'end' keyword`,
                                                   this.currentToken.positionStart,
                                                   this.currentToken.positionEnd);
      return parseResult.failure(syntaxError);
    }

    parseResult.registerAdvancement();
    this.advance();

    const ifNode: IfNode = {
      nodeType: NodeTypes.IFSTATEMENT,
      token: ifToken,
      cases: cases,
      elseCase: elseCase
    };
    return parseResult.success(ifNode);
  }

  private atom(): ParseResult {

    let parseResult = new ParseResult();
    let tok = this.currentToken;

    if (tok.type === TokenTypes.NUMBER) {
      parseResult.registerAdvancement();
      this.advance();
      let numberNode: NumberNode = { nodeType: NodeTypes.NUMBER, token: tok };
      return parseResult.success(numberNode);
    }
    else if (tok.type === TokenTypes.IDENTIFIER || tok.value === 'TRUE' ||
                                                    tok.value === 'FALSE') {
      parseResult.registerAdvancement();
      this.advance();
      const varAccessNode: VarAccessNode = { nodeType: NodeTypes.VARACCESS, token: tok };
      return parseResult.success(varAccessNode);
    }
    else if (tok.type === TokenTypes.L_BRACKET) {
      parseResult.registerAdvancement();
      this.advance();
      let expr = parseResult.register(this.expr());

      if (parseResult.getError() !== null) { return parseResult; }

      if (this.currentToken.type === TokenTypes.R_BRACKET) {
        parseResult.registerAdvancement();
        this.advance();
        return parseResult.success(expr);
      }
      else {
        const syntaxError = new InvalidSyntaxError(`missing ')'`, this.currentToken.positionStart,
                                                                  this.currentToken.positionEnd);
        return parseResult.failure(syntaxError);
      }
    }
    else if (tok.type === TokenTypes.KEYWORD && tok.value === 'if') {
      const ifExpr: ASTNode = parseResult.register(this.ifExpr());
      if (parseResult.getError() !== null) { return parseResult; }
      return parseResult.success(ifExpr);
    }

    const syntaxError = new InvalidSyntaxError(`Expected a number, identifier, '+', '-' or '('`,
                                                this.currentToken.positionStart,
                                                this.currentToken.positionEnd);

    return parseResult.failure(syntaxError);
  }

  private power(): ParseResult {
    const operators: Set<string> = new Set([TokenTypes.POWER]);
    return this.binaryOperators('atom', operators, 'factor');
  }

  private factor(): ParseResult {

    let parseResult = new ParseResult();
    let tok = this.currentToken;

    if (tok.type === TokenTypes.PLUS || tok.type === TokenTypes.MINUS) {
      parseResult.registerAdvancement();
      this.advance();
      let factor = parseResult.register(this.factor());

      if (parseResult.getError() !== null) { return parseResult; }

      const unaryOpNode: UnaryOpNode = { nodeType: NodeTypes.UNARYOP, token: tok, node: factor };
      return parseResult.success(unaryOpNode);
    }

    return this.power();
  }

  private term(): ParseResult {
    let operators: Set<string> = new Set([TokenTypes.MULTIPLY, TokenTypes.DIVIDE]);
    return this.binaryOperators('factor', operators);
  }

  private arithmeticExpr(): ParseResult {
    let operators: Set<string> = new Set([TokenTypes.PLUS, TokenTypes.MINUS]);
    return this.binaryOperators('term', operators);
  }

  private comparisonExpr(): ParseResult {
    let parseResult = new ParseResult();
    const operators: Set<string> = new Set([
      TokenTypes.EQUALITY, TokenTypes.G_THAN, TokenTypes.L_THAN, TokenTypes.G_THAN_EQ,
      TokenTypes.L_THAN_EQ
    ]);

    if (this.currentToken.type === TokenTypes.KEYWORD && this.currentToken.value === 'NOT') {
      const opToken = this.currentToken;
      parseResult.registerAdvancement();
      this.advance();

      const node: ASTNode = parseResult.register(this.comparisonExpr());

      if (parseResult.getError() !== null) { return parseResult; }

      const unaryNode: UnaryOpNode = {nodeType: NodeTypes.UNARYOP, token: opToken, node: node};
      return parseResult.success(unaryNode);
    }

    const node: ASTNode = parseResult.register(this.binaryOperators('arithmeticExpr', operators));

    if (parseResult.getError() !== null) {
      const syntaxError = new InvalidSyntaxError(`Expected number, identifier, '+', '-', '(' or 'NOT'`,
                               this.currentToken.positionStart, this.currentToken.positionEnd);

      return parseResult.failure(syntaxError);
    }

    return parseResult.success(node);
  }

  private expr(): ParseResult {
    let parseResult = new ParseResult();

    if (this.tokenIdx + 1 < this.tokens.length) {
      const nextToken: Token = this.tokens[this.tokenIdx+1];

      if (this.currentToken.type === TokenTypes.IDENTIFIER && nextToken.type === TokenTypes.EQUALS) {
        const tok = this.currentToken;

        parseResult.registerAdvancement();
        this.advance();
        parseResult.registerAdvancement();
        this.advance();

        const expr = parseResult.register(this.expr());
        if (parseResult.getError() !== null) { return parseResult; }

        const varAssignNode: VarAssignNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: tok,
          node: expr
        };
        return parseResult.success(varAssignNode);
      }
    }

    const node = parseResult.register(this.binaryOperators('comparisonExpr', new Set()));

    if (parseResult.getError() !== null) {
      const syntaxError = new InvalidSyntaxError(`Expected a number, identifier, '+', '-', '(' ` +
                                                `or 'NOT'`, this.currentToken.positionStart,
                                                this.currentToken.positionEnd);
      return parseResult.failure(syntaxError);
    }

    return parseResult.success(node);
  }

  public parse(): ParseResult {
    let parseResult: ParseResult = this.expr();

    if (parseResult.getError() === null && this.currentToken.type !== TokenTypes.EOF) {
      const syntaxError = new InvalidSyntaxError(`Expected '+', '-', '*', '/', '^', '==', '<',` +
                                                  ` '>', '<=', '>=', 'AND' or 'OR'`,
                                                  this.currentToken.positionStart,
                                                  this.currentToken.positionEnd);
      return parseResult.failure(syntaxError);
    }

    return parseResult;
  }
}
