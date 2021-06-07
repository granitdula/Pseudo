import { InvalidSyntaxError } from './invalid-syntax-error';
import { ASTNode } from '../models/ast-node';
import { Parser } from './parser';
import { PositionTracker } from './position-tracker';
import { Token } from '../models/token';
import { NUMBER, EOF, MINUS, PLUS, MULTIPLY, DIVIDE, L_BRACKET, R_BRACKET } from './token-type.constants';
import { ParseResult } from './parse-result';

describe('Parser tests', () => {
  describe('parse tests', () => {
    describe('arithmetic expression tests', () => {
      it('should return a single number node result with one number in token list', () => {
        const posStart = new PositionTracker(0, 1, 1);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [createToken(NUMBER, posStart, 10),
                                        createToken(EOF, posStartEof)];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = { token: createToken(NUMBER, posStart, 10) };
        let expected = new ParseResult();
        expected = expected.success(numberNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return a single number node result with one decimal number in token list', () => {
        const posStart = new PositionTracker(0, 1, 1);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [createToken(NUMBER, posStart, 3.14),
                                        createToken(EOF, posStartEof)];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = { token: createToken(NUMBER, posStart, 3.14) };
        let expected = new ParseResult();
        expected = expected.success(numberNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for unary operation expression: -1', () => {
        const posStartMinus = new PositionTracker(0, 1, 1);
        const posStartNumber = new PositionTracker(1, 1, 2);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [
          createToken(MINUS, posStartMinus), createToken(NUMBER, posStartNumber, 1),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = { token: createToken(NUMBER, posStartNumber, 1) };
        const unaryNode: ASTNode = { token: createToken(MINUS, posStartMinus), node: numberNode };
        let expected = new ParseResult();
        expected = expected.success(unaryNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for unary operation expression: +1', () => {
        const posStartPlus = new PositionTracker(0, 1, 1);
        const posStartNumber = new PositionTracker(1, 1, 2);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [
          createToken(PLUS, posStartPlus), createToken(NUMBER, posStartNumber, 1),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = { token: createToken(NUMBER, posStartNumber, 1) };
        const unaryNode: ASTNode = { token: createToken(PLUS, posStartPlus), node: numberNode };
        let expected = new ParseResult();
        expected = expected.success(unaryNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for binary operation expression: 3 + 4', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartPlus = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 3), createToken(PLUS, posStartPlus),
          createToken(NUMBER, posStartNum2, 4), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 3) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 4) };
        const binaryNode: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for binary operation expression: 10 - 9', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartMinus = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 10), createToken(MINUS, posStartMinus),
          createToken(NUMBER, posStartNum2, 9), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 10) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 9) };
        const binaryNode: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for binary operation expression: 8 * 4', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartMultiply = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 8), createToken(MULTIPLY, posStartMultiply),
          createToken(NUMBER, posStartNum2, 4), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 8) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 4) };
        const binaryNode: ASTNode = {
          token: createToken(MULTIPLY, posStartMultiply),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for binary operation expression: 8 / 4', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartDivide = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 8), createToken(DIVIDE, posStartDivide),
          createToken(NUMBER, posStartNum2, 4), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 8) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 4) };
        const binaryNode: ASTNode = {
          token: createToken(DIVIDE, posStartDivide),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for expression: ((1 + 2) * (4 - 1))', () => {
        const posStartOuterLeftBrack = new PositionTracker(0, 1, 1);
        const posStartInnerLeftBrack1 = new PositionTracker(1, 1, 2);
        const posStartNum1 = new PositionTracker(2, 1, 3);
        const posStartPlus = new PositionTracker(4, 1, 5);
        const posStartNum2 = new PositionTracker(6, 1, 7);
        const posStartInnerRightBrack1 = new PositionTracker(7, 1, 8);
        const posStartMultiply = new PositionTracker(9, 1, 10);
        const posStartInnerLeftBrack2 = new PositionTracker(11, 1, 12);
        const posStartNum3 = new PositionTracker(12, 1, 13);
        const posStartMinus = new PositionTracker(14, 1, 15);
        const posStartNum4 = new PositionTracker(16, 1, 17);
        const posStartInnerRightBrack2 = new PositionTracker(17, 1, 18);
        const posStartOuterRightBrack = new PositionTracker(18, 1, 19);
        const posStartEof = new PositionTracker(19, 1, 20);

        const tokenList: Array<Token> = [
          createToken(L_BRACKET, posStartOuterLeftBrack),
          createToken(L_BRACKET, posStartInnerLeftBrack1),
          createToken(NUMBER, posStartNum1, 1), createToken(PLUS, posStartPlus),
          createToken(NUMBER, posStartNum2, 2), createToken(R_BRACKET, posStartInnerRightBrack1),
          createToken(MULTIPLY, posStartMultiply), createToken(L_BRACKET, posStartInnerLeftBrack2),
          createToken(NUMBER, posStartNum3, 4), createToken(MINUS, posStartMinus),
          createToken(NUMBER, posStartNum4, 1), createToken(R_BRACKET, posStartInnerRightBrack2),
          createToken(R_BRACKET, posStartOuterRightBrack), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 2) };
        const leftBinaryExp: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 4) };
        const numberNode4: ASTNode = { token: createToken(NUMBER, posStartNum4, 1) };
        const rightBinaryExp: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          leftChild: numberNode3,
          rightChild: numberNode4
        };

        const ast: ASTNode = {
          token: createToken(MULTIPLY, posStartMultiply),
          leftChild: leftBinaryExp,
          rightChild: rightBinaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for expression: (1 + 2) / 3', () => {
        const posStartLeftBrack = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartPlus = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartRightBrack = new PositionTracker(6, 1, 7);
        const posStartDivide = new PositionTracker(8, 1, 9);
        const posStartNum3 = new PositionTracker(10, 1, 11);
        const posStartEof = new PositionTracker(11, 1, 12);

        const tokenList: Array<Token> = [
          createToken(L_BRACKET, posStartLeftBrack), createToken(NUMBER, posStartNum1, 1),
          createToken(PLUS, posStartPlus), createToken(NUMBER, posStartNum2, 2),
          createToken(R_BRACKET, posStartRightBrack), createToken(DIVIDE, posStartDivide),
          createToken(NUMBER, posStartNum3, 3), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 2) };
        const binaryExp: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 3) };

        const ast: ASTNode = {
          token: createToken(DIVIDE, posStartDivide),
          leftChild: binaryExp,
          rightChild: numberNode3
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for expression: -((1 + 2) * (4 - 1))', () => {
        const posStartMinusUnary = new PositionTracker(0, 1, 1);
        const posStartOuterLeftBrack = new PositionTracker(1, 1, 2);
        const posStartInnerLeftBrack1 = new PositionTracker(2, 1, 3);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartPlus = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartInnerRightBrack1 = new PositionTracker(8, 1, 9);
        const posStartMultiply = new PositionTracker(10, 1, 11);
        const posStartInnerLeftBrack2 = new PositionTracker(12, 1, 13);
        const posStartNum3 = new PositionTracker(13, 1, 14);
        const posStartMinus = new PositionTracker(15, 1, 16);
        const posStartNum4 = new PositionTracker(17, 1, 18);
        const posStartInnerRightBrack2 = new PositionTracker(18, 1, 19);
        const posStartOuterRightBrack = new PositionTracker(19, 1, 20);
        const posStartEof = new PositionTracker(20, 1, 21);

        const tokenList: Array<Token> = [
          createToken(MINUS, posStartMinusUnary), createToken(L_BRACKET, posStartOuterLeftBrack),
          createToken(L_BRACKET, posStartInnerLeftBrack1),
          createToken(NUMBER, posStartNum1, 1), createToken(PLUS, posStartPlus),
          createToken(NUMBER, posStartNum2, 2), createToken(R_BRACKET, posStartInnerRightBrack1),
          createToken(MULTIPLY, posStartMultiply), createToken(L_BRACKET, posStartInnerLeftBrack2),
          createToken(NUMBER, posStartNum3, 4), createToken(MINUS, posStartMinus),
          createToken(NUMBER, posStartNum4, 1), createToken(R_BRACKET, posStartInnerRightBrack2),
          createToken(R_BRACKET, posStartOuterRightBrack), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 2) };
        const leftBinaryExp: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 4) };
        const numberNode4: ASTNode = { token: createToken(NUMBER, posStartNum4, 1) };
        const rightBinaryExp: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          leftChild: numberNode3,
          rightChild: numberNode4
        };

        const outerBinaryExp: ASTNode = {
          token: createToken(MULTIPLY, posStartMultiply),
          leftChild: leftBinaryExp,
          rightChild: rightBinaryExp
        };

        const unaryExp: ASTNode = {
          token: createToken(MINUS, posStartMinusUnary),
          node: outerBinaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(unaryExp);

        expect(parseResult).toEqual(expected);
      });

      it('should return parse result with correct missing operation error for expression: 10 200', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posEndNum1 = new PositionTracker(1, 1, 2);
        const posStartNum2 = new PositionTracker(3, 1, 4);
        const posStartEof = new PositionTracker(4, 1, 5);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 10), createToken(NUMBER, posStartNum2, 200),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 10) };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*' or '/'`, posStartNum1,
                                                                               posEndNum1);

        let expected = new ParseResult();
        expected.success(numberNode1);
        expected.failure(error);

        expect(parseResult).toEqual(expected);
      });

      it('should return parse result with correct missing operation error for expression: (1 + 2) 4', () => {
        const posStartLeftBrack = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartPlus = new PositionTracker(3, 1, 4);
        const posEndPlus = new PositionTracker(4, 1, 5);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartRightBrack = new PositionTracker(6, 1, 7);
        const posStartNum3 = new PositionTracker(8, 1, 9);
        const posStartEof = new PositionTracker(9, 1, 10);

        const tokenList: Array<Token> = [
          createToken(L_BRACKET, posStartLeftBrack), createToken(NUMBER, posStartNum1, 1),
          createToken(PLUS, posStartPlus), createToken(NUMBER, posStartNum2, 2),
          createToken(R_BRACKET, posStartRightBrack), createToken(NUMBER, posStartNum3, 4),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 2) };
        const binaryExp: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const error = new InvalidSyntaxError(`Expected '+', '-', '*' or '/'`, posStartPlus,
                                                                               posEndPlus);

        let expected = new ParseResult();
        expected.success(binaryExp);
        expected.failure(error);

        expect(parseResult).toEqual(expected);
      });

      it(`should return parse result with correct 'missing ')'' error for expression: ((1 + 2) - 1`, () => {
        const posStartLeftBrack1 = new PositionTracker(0, 1, 1);
        const posStartLeftBrack2 = new PositionTracker(1, 1, 2);
        const posStartNum1 = new PositionTracker(2, 1, 3);
        const posStartPlus = new PositionTracker(4, 1, 5);
        const posStartNum2 = new PositionTracker(6, 1, 7);
        const posStartRightBrack = new PositionTracker(7, 1, 8);
        const posStartMinus = new PositionTracker(9, 1, 10);
        const posStartNum3 = new PositionTracker(11, 1, 12);
        const posStartEof = new PositionTracker(12, 1, 13);
        const posEndEof = new PositionTracker(13, 1, 14);

        const tokenList: Array<Token> = [
          createToken(L_BRACKET, posStartLeftBrack1), createToken(L_BRACKET, posStartLeftBrack2),
          createToken(NUMBER, posStartNum1, 1), createToken(PLUS, posStartPlus),
          createToken(NUMBER, posStartNum2, 2), createToken(R_BRACKET, posStartRightBrack),
          createToken(MINUS, posStartMinus), createToken(NUMBER, posStartNum3, 1),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`missing ')'`, posStartEof, posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        expect(parseResult).toEqual(expected);
      });
    });
  });
});

// Utility functions.
function createToken(type: string, posStart: PositionTracker, value?: any): Token {

  let token: Token;

  const posStartNew = posStart.copy();
  let posEnd = posStart.copy();
  posEnd.advance();

  if (value === undefined) {
    token = {
      type: type,
      positionStart: posStartNew,
      positionEnd: posEnd
    };
  }
  else {
    token = {
      type: type,
      positionStart: posStartNew,
      positionEnd: posEnd,
      value: value
    };
  }

  return token;
}
