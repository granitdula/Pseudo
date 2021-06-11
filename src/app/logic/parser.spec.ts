import { InvalidSyntaxError } from './invalid-syntax-error';
import { ASTNode } from '../models/ast-node';
import { Parser } from './parser';
import { PositionTracker } from './position-tracker';
import { Token } from '../models/token';
import { NUMBER, EOF, MINUS, PLUS, MULTIPLY, DIVIDE, L_BRACKET, R_BRACKET, POWER, IDENTIFIER, EQUALS } from '../constants/token-type.constants';
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

        expected.registerAdvancement();

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

        expected.registerAdvancement();

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

        expected.registerAdvancement();
        expected.registerAdvancement();

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

        expected.registerAdvancement();
        expected.registerAdvancement();

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

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

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

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

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

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

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

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for binary operation expression: 3 ^ 2', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartPower = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 3), createToken(POWER, posStartPower),
          createToken(NUMBER, posStartNum2, 2), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 3) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 2) };
        const binaryNode: ASTNode = {
          token: createToken(POWER, posStartPower),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

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

        for (let i = 0; i < 13; i++) { expected.registerAdvancement(); }

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

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for expression: 1 + 2 ^ 3 - 4', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartPlus = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartPower = new PositionTracker(6, 1, 7);
        const posStartNum3 = new PositionTracker(8, 1, 9);
        const posStartMinus = new PositionTracker(10, 1, 11);
        const posStartNum4 = new PositionTracker(12, 1, 13);
        const posStartEof = new PositionTracker(13, 1, 14);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 1), createToken(PLUS, posStartPlus),
          createToken(NUMBER, posStartNum2, 2), createToken(POWER, posStartPower),
          createToken(NUMBER, posStartNum3, 3), createToken(MINUS, posStartMinus),
          createToken(NUMBER, posStartNum4, 4), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 2) };
        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 3) };
        const powerBinaryExp: ASTNode = {
          token: createToken(POWER, posStartPower),
          leftChild: numberNode2,
          rightChild: numberNode3
        };

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const plusBinaryExp: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: powerBinaryExp
        };

        const numberNode4: ASTNode = { token: createToken(NUMBER, posStartNum4, 4) };
        const ast: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          leftChild: plusBinaryExp,
          rightChild: numberNode4
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for expression: -2 ^ 3', () => {
        const posStartMinus = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartPower = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(MINUS, posStartMinus), createToken(NUMBER, posStartNum1, 2),
          createToken(POWER, posStartPower), createToken(NUMBER, posStartNum2, 3),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 2) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 3) };
        const powerBinaryExp: ASTNode = {
          token: createToken(POWER, posStartPower),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const ast: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          node: powerBinaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for expression: (1 + 2) ^ 3 - 4', () => {
        const posStartLeftBrack = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartPlus = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartRightBrack = new PositionTracker(6, 1, 7);
        const posStartPower = new PositionTracker(7, 1, 8);
        const posStartNum3 = new PositionTracker(9, 1, 10);
        const posStartMinus = new PositionTracker(11, 1, 12);
        const posStartNum4 = new PositionTracker(13, 1, 14);
        const posStartEof = new PositionTracker(14, 1, 15);

        const tokenList: Array<Token> = [
          createToken(L_BRACKET, posStartLeftBrack), createToken(NUMBER, posStartNum1, 1),
          createToken(PLUS, posStartPlus), createToken(NUMBER, posStartNum2, 2),
          createToken(R_BRACKET, posStartRightBrack), createToken(POWER, posStartPower),
          createToken(NUMBER, posStartNum3, 3), createToken(MINUS, posStartMinus),
          createToken(NUMBER, posStartNum4, 4), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 2) };
        const plusBinaryExp: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 3) };
        const powerBinaryExp: ASTNode = {
          token: createToken(POWER, posStartPower),
          leftChild: plusBinaryExp,
          rightChild: numberNode3
        };

        const numberNode4: ASTNode = { token: createToken(NUMBER, posStartNum4, 4) };
        const ast: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          leftChild: powerBinaryExp,
          rightChild: numberNode4
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 9; i++) { expected.registerAdvancement(); }

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

        for (let i = 0; i < 14; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return parse result with correct missing operation error for expression: 10 200', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartNum2 = new PositionTracker(3, 1, 4);
        const posStartEof = new PositionTracker(4, 1, 5);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 10), createToken(NUMBER, posStartNum2, 200),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 10) };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/' or '^'`, posStartNum2,
                                                                               posStartEof);

        let expected = new ParseResult();
        expected.success(numberNode1);
        expected.failure(error);

        expected.registerAdvancement();

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

        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/' or '^'`, posStartNum3,
                                                                               posStartEof);

        let expected = new ParseResult();
        expected.success(binaryExp);
        expected.failure(error);

        for (let i = 0; i < 5; i++) { expected.registerAdvancement(); }

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

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });
    });

    describe('variable assignment tests', () => {
      it('should return correct AST for statement: variable = 1', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(9, 1, 10);
        const posStartNum1 = new PositionTracker(11, 1, 12);
        const posStartEof = new PositionTracker(12, 1, 13);

        const tokenList: Array<Token> = [
          createToken(IDENTIFIER, posStartVariable, 'variable'),
          createToken(EQUALS, posStartEquals), createToken(NUMBER, posStartNum1, 1),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const ast: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable, 'variable'),
          node: numberNode1
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for statement: variable = (1 * 3) ^ 2', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(11, 1, 12);
        const posStartNum1 = new PositionTracker(12, 1, 13);
        const posStartMultiply = new PositionTracker(14, 1, 15);
        const posStartNum2 = new PositionTracker(16, 1, 17);
        const posStartRightBrack = new PositionTracker(17, 1, 18);
        const posStartPower = new PositionTracker(19, 1, 20);
        const posStartNum3 = new PositionTracker(21, 1, 22);
        const posStartEof = new PositionTracker(22, 1, 23);

        const tokenList: Array<Token> = [
          createToken(IDENTIFIER, posStartVariable, 'variable'),
          createToken(EQUALS, posStartEquals), createToken(L_BRACKET, posStartLeftBrack),
          createToken(NUMBER, posStartNum1, 1), createToken(MULTIPLY, posStartMultiply),
          createToken(NUMBER, posStartNum2, 3), createToken(R_BRACKET, posStartRightBrack),
          createToken(POWER, posStartPower), createToken(NUMBER, posStartNum3, 2),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 3) };
        const binaryMultExp: ASTNode = {
          token: createToken(MULTIPLY, posStartMultiply),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 2) };
        const binaryPowerExp: ASTNode = {
          token: createToken(POWER, posStartPower),
          leftChild: binaryMultExp,
          rightChild: numberNode3
        };

        const ast: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable, 'variable'),
          node: binaryPowerExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 9; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for statement: variable = -((1 * 3) ^ 2)', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(9, 1, 10);
        const posStartMinus = new PositionTracker(11, 1, 12);
        const posStartOuterLeftBrack = new PositionTracker(12, 1, 13);
        const posStartInnerLeftBrack = new PositionTracker(13, 1, 14);
        const posStartNum1 = new PositionTracker(14, 1, 15);
        const posStartMultiply = new PositionTracker(16, 1, 17);
        const posStartNum2 = new PositionTracker(18, 1, 19);
        const posStartInnerRightBrack = new PositionTracker(19, 1, 20);
        const posStartPower = new PositionTracker(21, 1, 22);
        const posStartNum3 = new PositionTracker(23, 1, 24);
        const posStartOuterRightBrack = new PositionTracker(24, 1, 25);
        const posStartEof = new PositionTracker(25, 1, 26);

        const tokenList: Array<Token> = [
          createToken(IDENTIFIER, posStartVariable, 'variable'),
          createToken(EQUALS, posStartEquals), createToken(MINUS, posStartMinus),
          createToken(L_BRACKET, posStartOuterLeftBrack),
          createToken(L_BRACKET, posStartInnerLeftBrack), createToken(NUMBER, posStartNum1, 1),
          createToken(MULTIPLY, posStartMultiply), createToken(NUMBER, posStartNum2, 3),
          createToken(R_BRACKET, posStartInnerRightBrack), createToken(POWER, posStartPower),
          createToken(NUMBER, posStartNum3, 2), createToken(R_BRACKET, posStartOuterRightBrack),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 3) };
        const binaryMultExp: ASTNode = {
          token: createToken(MULTIPLY, posStartMultiply),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 2) };
        const binaryPowerExp: ASTNode = {
          token: createToken(POWER, posStartPower),
          leftChild: binaryMultExp,
          rightChild: numberNode3
        };

        const unaryExp: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          node: binaryPowerExp
        };

        const ast: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable, 'variable'),
          node: unaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 12; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for statement: 1 + (x = 10) * 2', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartPlus = new PositionTracker(2, 1, 3);
        const posStartLeftBrack = new PositionTracker(4, 1, 5);
        const posStartVariable = new PositionTracker(5, 1, 6);
        const posStartEquals = new PositionTracker(7, 1, 8);
        const posStartNum2 = new PositionTracker(9, 1, 10);
        const posStartRightBrack = new PositionTracker(10, 1, 11);
        const posStartMultiply = new PositionTracker(12, 1, 13);
        const posStartNum3 = new PositionTracker(14, 1, 15);
        const posStartEof = new PositionTracker(15, 1, 16);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 1), createToken(PLUS, posStartPlus),
          createToken(L_BRACKET, posStartLeftBrack),
          createToken(IDENTIFIER, posStartVariable, 'x'), createToken(EQUALS, posStartEquals),
          createToken(NUMBER, posStartNum2, 10), createToken(R_BRACKET, posStartRightBrack),
          createToken(MULTIPLY, posStartMultiply), createToken(NUMBER, posStartNum3, 2),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode2: ASTNode = { token: createToken(NUMBER, posStartNum2, 10) };
        const varAssignNode: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable, 'x'),
          node: numberNode2
        };

        const numberNode3: ASTNode = { token: createToken(NUMBER, posStartNum3, 2) };
        const binaryMultiplyExp: ASTNode = {
          token: createToken(MULTIPLY, posStartMultiply),
          leftChild: varAssignNode,
          rightChild: numberNode3
        };

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const ast: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: binaryMultiplyExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 9; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct error in parse result for expression: x =', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(2, 1, 3);
        const posStartEof = new PositionTracker(3, 1, 4);
        const posEndEof = new PositionTracker(4, 1, 5);

        const tokenList: Array<Token> = [
          createToken(IDENTIFIER, posStartVariable, 'x'), createToken(EQUALS, posStartEquals),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected a number, identifier, '+', '-' or '('`, posStartEof, posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct error in parse result for expression: 1 + x = 10 * 2', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartPlus = new PositionTracker(2, 1, 3);
        const posStartVariable = new PositionTracker(4, 1, 5);
        const posStartEquals = new PositionTracker(6, 1, 7);
        const posEndEquals = new PositionTracker(7, 1, 8);
        const posStartNum2 = new PositionTracker(8, 1, 9);
        const posStartMultiply = new PositionTracker(10, 1, 11);
        const posStartNum3 = new PositionTracker(12, 1, 13);
        const posStartEof = new PositionTracker(13, 1, 14);

        const tokenList: Array<Token> = [
          createToken(NUMBER, posStartNum1, 1), createToken(PLUS, posStartPlus),
          createToken(IDENTIFIER, posStartVariable, 'x'), createToken(EQUALS, posStartEquals),
          createToken(NUMBER, posStartNum2, 10), createToken(MULTIPLY, posStartMultiply),
          createToken(NUMBER, posStartNum3, 2), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = { token: createToken(NUMBER, posStartNum1, 1) };
        const varAccessNode: ASTNode = { token: createToken(IDENTIFIER, posStartVariable, 'x') };
        const currentAst: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: varAccessNode
        };

        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/' or '^'`, posStartEquals, posEndEquals);

        let expected = new ParseResult();
        expected.success(currentAst);
        expected.failure(error);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });
    });

    describe('variable access tests', () => {
      it('should return correct AST for statement: (1 + x) * (y - z)', () => {
        const posStartLeftBrack1 = new PositionTracker(0, 1, 1);
        const posStartNum = new PositionTracker(1, 1, 2);
        const posStartPlus = new PositionTracker(3, 1, 4);
        const posStartVariable1 = new PositionTracker(5, 1, 6);
        const posStartRightBrack1 = new PositionTracker(6, 1, 7);
        const posStartMultiply = new PositionTracker(8, 1, 9);
        const posStartLeftBrack2 = new PositionTracker(10, 1, 11);
        const posStartVariable2 = new PositionTracker(11, 1, 12);
        const posStartMinus = new PositionTracker(13, 1, 14);
        const posStartVariable3 = new PositionTracker(15, 1, 16);
        const posStartRightBrack2 = new PositionTracker(16, 1, 17);
        const posStartEof = new PositionTracker(17, 1, 18);

        const tokenList: Array<Token> = [
          createToken(L_BRACKET, posStartLeftBrack1), createToken(NUMBER, posStartNum, 1),
          createToken(PLUS, posStartPlus), createToken(IDENTIFIER, posStartVariable1, 'x'),
          createToken(R_BRACKET, posStartRightBrack1), createToken(MULTIPLY, posStartMultiply),
          createToken(L_BRACKET, posStartLeftBrack2),
          createToken(IDENTIFIER, posStartVariable2, 'y'), createToken(MINUS, posStartMinus),
          createToken(IDENTIFIER, posStartVariable3, 'z'),
          createToken(R_BRACKET, posStartRightBrack2), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = { token: createToken(NUMBER, posStartNum, 1) };
        const xVarAccessNode: ASTNode = { token: createToken(IDENTIFIER, posStartVariable1, 'x') };
        const binaryPlusExp: ASTNode = {
          token: createToken(PLUS, posStartPlus),
          leftChild: numberNode,
          rightChild: xVarAccessNode
        };

        const yVarAccessNode: ASTNode = { token: createToken(IDENTIFIER, posStartVariable2, 'y') };
        const zVarAccessNode: ASTNode = { token: createToken(IDENTIFIER, posStartVariable3, 'z') };
        const binaryMinusExp: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          leftChild: yVarAccessNode,
          rightChild: zVarAccessNode
        };

        const ast: ASTNode = {
          token: createToken(MULTIPLY, posStartMultiply),
          leftChild: binaryPlusExp,
          rightChild: binaryMinusExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 11; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for statement: x = y', () => {
        const posStartVariable1 = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(2, 1, 3);
        const posStartVariable2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(IDENTIFIER, posStartVariable1, 'x'), createToken(EQUALS, posStartEquals),
          createToken(IDENTIFIER, posStartVariable2, 'y'), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const yVarAccessNode: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable2, 'y')
        };
        const ast: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable1, 'x'),
          node: yVarAccessNode
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct AST for statement: -variable', () => {
        const posStartMinus = new PositionTracker(0, 1, 1);
        const posStartVariable = new PositionTracker(1, 1, 2);
        const posStartEof = new PositionTracker(9, 1, 10);

        const tokenList: Array<Token> = [
          createToken(MINUS, posStartMinus), createToken(IDENTIFIER, posStartVariable, 'variable'),
          createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const varAccessNode: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable, 'variable')
        };
        const ast: ASTNode = {
          token: createToken(MINUS, posStartMinus),
          node: varAccessNode
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult).toEqual(expected);
      });

      it('should return correct error in parse result for expression: x y', () => {
        const posStartVariable1 = new PositionTracker(0, 1, 1);
        const posStartVariable2 = new PositionTracker(2, 1, 3);
        const posStartEof = new PositionTracker(3, 1, 4);

        const tokenList: Array<Token> = [
          createToken(IDENTIFIER, posStartVariable1, 'x'),
          createToken(IDENTIFIER, posStartVariable2, 'y'), createToken(EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const xVarAccessNode: ASTNode = {
          token: createToken(IDENTIFIER, posStartVariable1, 'x')
        };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/' or '^'`,
                                              posStartVariable2, posStartEof);

        let expected = new ParseResult();
        expected.success(xVarAccessNode);
        expected.failure(error);

        expected.registerAdvancement();

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
