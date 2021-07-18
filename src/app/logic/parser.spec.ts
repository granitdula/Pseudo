import { InvalidSyntaxError } from './invalid-syntax-error';
import { ASTNode } from '../models/ast-node';
import { Parser } from './parser';
import { PositionTracker } from './position-tracker';
import { Token } from '../models/token';
import * as TokenTypes from '../constants/token-type.constants';
import * as NodeTypes from '../constants/node-type.constants';
import { ParseResult } from './parse-result';
import { createToken } from '../utils/token-functions';

describe('Parser tests', () => {
  describe('parse tests', () => {
    describe('arithmetic expression tests', () => {
      it('should return a single number node result with one number in token list', () => {
        const posStart = new PositionTracker(0, 1, 1);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [createToken(TokenTypes.NUMBER, posStart, 10),
                                        createToken(TokenTypes.EOF, posStartEof)];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStart, 10)
        };
        let expected = new ParseResult();
        expected = expected.success(numberNode);

        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return a single number node result with one decimal number in token list', () => {
        const posStart = new PositionTracker(0, 1, 1);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [createToken(TokenTypes.NUMBER, posStart, 3.14),
                                        createToken(TokenTypes.EOF, posStartEof)];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStart, 3.14)
        };
        let expected = new ParseResult();
        expected = expected.success(numberNode);

        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for unary operation expression: -1', () => {
        const posStartMinus = new PositionTracker(0, 1, 1);
        const posStartNumber = new PositionTracker(1, 1, 2);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNumber, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNumber, 1)
        };
        const unaryNode: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus), node: numberNode
        };
        let expected = new ParseResult();
        expected = expected.success(unaryNode);

        expected.registerAdvancement();
        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for unary operation expression: +1', () => {
        const posStartPlus = new PositionTracker(0, 1, 1);
        const posStartNumber = new PositionTracker(1, 1, 2);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNumber, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNumber, 1)
        };
        const unaryNode: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus), node: numberNode
        };
        let expected = new ParseResult();
        expected = expected.success(unaryNode);

        expected.registerAdvancement();
        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for binary operation expression: 3 + 4', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartPlus = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 3),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 4),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 3)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 4)
        };
        const binaryNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for binary operation expression: 10 - 9', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartMinus = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 10),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNum2, 9),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 10)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 9)
        };
        const binaryNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for binary operation expression: 8 * 4', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartMultiply = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 8),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.NUMBER, posStartNum2, 4),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 8)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 4)
        };
        const binaryNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for binary operation expression: 8 / 4', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartDivide = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 8),
          createToken(TokenTypes.DIVIDE, posStartDivide),
          createToken(TokenTypes.NUMBER, posStartNum2, 4),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 8)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 4)
        };
        const binaryNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.DIVIDE, posStartDivide),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for binary operation expression: 3 ^ 2', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartPower = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 3),
          createToken(TokenTypes.POWER, posStartPower),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 3)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const binaryNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.POWER, posStartPower),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(binaryNode);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.L_BRACKET, posStartOuterLeftBrack),
          createToken(TokenTypes.L_BRACKET, posStartInnerLeftBrack1),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_BRACKET, posStartInnerRightBrack1),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.L_BRACKET, posStartInnerLeftBrack2),
          createToken(TokenTypes.NUMBER, posStartNum3, 4),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.R_BRACKET, posStartInnerRightBrack2),
          createToken(TokenTypes.R_BRACKET, posStartOuterRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const leftBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 4)
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1)
        };
        const rightBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          leftChild: numberNode3,
          rightChild: numberNode4
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply),
          leftChild: leftBinaryExp,
          rightChild: rightBinaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 13; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.DIVIDE, posStartDivide),
          createToken(TokenTypes.NUMBER, posStartNum3, 3),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const binaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 3)
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.DIVIDE, posStartDivide),
          leftChild: binaryExp,
          rightChild: numberNode3
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.POWER, posStartPower),
          createToken(TokenTypes.NUMBER, posStartNum3, 3),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNum4, 4),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 3)
        };
        const powerBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.POWER, posStartPower),
          leftChild: numberNode2,
          rightChild: numberNode3
        };

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const plusBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: powerBinaryExp
        };

        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 4)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          leftChild: plusBinaryExp,
          rightChild: numberNode4
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for expression: -2 ^ 3', () => {
        const posStartMinus = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartPower = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNum1, 2),
          createToken(TokenTypes.POWER, posStartPower),
          createToken(TokenTypes.NUMBER, posStartNum2, 3),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 2)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 3)
        };
        const powerBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.POWER, posStartPower),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          node: powerBinaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.POWER, posStartPower),
          createToken(TokenTypes.NUMBER, posStartNum3, 3),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNum4, 4),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const plusBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 3)
        };
        const powerBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.POWER, posStartPower),
          leftChild: plusBinaryExp,
          rightChild: numberNode3
        };

        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 4)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          leftChild: powerBinaryExp,
          rightChild: numberNode4
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 9; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.MINUS, posStartMinusUnary),
          createToken(TokenTypes.L_BRACKET, posStartOuterLeftBrack),
          createToken(TokenTypes.L_BRACKET, posStartInnerLeftBrack1),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_BRACKET, posStartInnerRightBrack1),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.L_BRACKET, posStartInnerLeftBrack2),
          createToken(TokenTypes.NUMBER, posStartNum3, 4),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.R_BRACKET, posStartInnerRightBrack2),
          createToken(TokenTypes.R_BRACKET, posStartOuterRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const leftBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 4)
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1)
        };
        const rightBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          leftChild: numberNode3,
          rightChild: numberNode4
        };

        const outerBinaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply),
          leftChild: leftBinaryExp,
          rightChild: rightBinaryExp
        };

        const unaryExp: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinusUnary),
          node: outerBinaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(unaryExp);

        for (let i = 0; i < 14; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return parse result with correct missing operation error for expression: 10 200', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartNum2 = new PositionTracker(3, 1, 4);
        const posStartEof = new PositionTracker(4, 1, 5);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 10),
          createToken(TokenTypes.NUMBER, posStartNum2, 200),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 10)
        };
        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 10),
          elementNodes: [numberNode1]
        };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/', '^', '==', '<', ` +
                                             `'>', '<=', '>=', 'AND' or 'OR'`, posStartNum2,
                                              posStartEof);

        let expected = new ParseResult();
        expected.success(listNode);
        expected.failure(error);

        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return parse result with correct missing operation error for expression: (1 + 2) 4', () => {
        const posStartLeftBrack = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartPlus = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartRightBrack = new PositionTracker(6, 1, 7);
        const posStartNum3 = new PositionTracker(8, 1, 9);
        const posStartEof = new PositionTracker(9, 1, 10);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.NUMBER, posStartNum3, 4),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const binaryExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: numberNode2
        };
        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          elementNodes: [binaryExp]
        };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/', '^', '==', '<', ` +
                                             `'>', '<=', '>=', 'AND' or 'OR'`, posStartNum3,
                                              posStartEof);

        let expected = new ParseResult();
        expected.success(listNode);
        expected.failure(error);

        for (let i = 0; i < 5; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack1),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack2),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`missing ')'`, posStartEof, posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('string expression tests', () => {
      it('should return correct AST for expression: "some string"', () => {
        const posStartString = new PositionTracker(0, 1, 1);
        const posStartEof = new PositionTracker(13, 1, 14);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.STRING, posStartString, 'some string'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const ast: ASTNode = {
          nodeType: NodeTypes.STRING,
          token: createToken(TokenTypes.STRING, posStartString, 'some string')
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('list expression tests', () => {
      it('should return correct AST for statement: []', () => {
        const posStartLeftSquare = new PositionTracker(0, 1, 1);
        const posStartRightSquare = new PositionTracker(1, 1, 2);
        const posStartEof = new PositionTracker(2, 1, 3);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const ast: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          elementNodes: []
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: [1, 2, 3]', () => {
        const posStartLeftSquare = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartComma1 = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartComma2 = new PositionTracker(5, 1, 6);
        const posStartNum3 = new PositionTracker(7, 1, 8);
        const posStartRightSquare = new PositionTracker(8, 1, 9);
        const posStartEof = new PositionTracker(9, 1, 10);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.NUMBER, posStartNum3, 3),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 3)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          elementNodes: [numberNode1, numberNode2, numberNode3]
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: [1, 2, "string"]', () => {
        const posStartLeftSquare = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartComma1 = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartComma2 = new PositionTracker(5, 1, 6);
        const posStartString = new PositionTracker(7, 1, 8);
        const posStartRightSquare = new PositionTracker(15, 1, 16);
        const posStartEof = new PositionTracker(16, 1, 17);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.STRING, posStartString, 'string'),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const stringNode: ASTNode = {
          nodeType: NodeTypes.STRING,
          token: createToken(TokenTypes.STRING, posStartString, 'string')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          elementNodes: [numberNode1, numberNode2, stringNode]
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: [[]]', () => {
        const posStartLeftSquare1 = new PositionTracker(0, 1, 1);
        const posStartLeftSquare2 = new PositionTracker(1, 1, 2);
        const posStartRightSquare1 = new PositionTracker(2, 1, 3);
        const posStartRightSquare2 = new PositionTracker(3, 1, 4);
        const posStartEof = new PositionTracker(4, 1, 5);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare1),
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare2),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare1),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare2),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const innerListNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare2),
          elementNodes: []
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare1),
          elementNodes: [innerListNode]
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: [[1, 2], [1, 3]]', () => {
        const posStartLeftSquare1 = new PositionTracker(0, 1, 1);
        const posStartLeftSquare2 = new PositionTracker(1, 1, 2);
        const posStartNum1 = new PositionTracker(2, 1, 3);
        const posStartComma1 = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartRightSquare1 = new PositionTracker(6, 1, 7);
        const posStartComma2 = new PositionTracker(7, 1, 8);
        const posStartLeftSquare3 = new PositionTracker(9, 1, 10);
        const posStartNum3 = new PositionTracker(10, 1, 11);
        const posStartComma3 = new PositionTracker(11, 1, 12);
        const posStartNum4 = new PositionTracker(13, 1, 14);
        const posStartRightSquare2 = new PositionTracker(14, 1, 15);
        const posStartRightSquare3 = new PositionTracker(15, 1, 16);
        const posStartEof = new PositionTracker(16, 1, 17);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare1),
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare2),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare1),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare3),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.COMMA, posStartComma3),
          createToken(TokenTypes.NUMBER, posStartNum4, 3),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare2),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare3),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const listNode1: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare2),
          elementNodes: [numberNode1, numberNode2]
        }

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 1)
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 3)
        };
        const listNode2: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare3),
          elementNodes: [numberNode3, numberNode4]
        }

        const ast: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.L_SQUARE, posStartLeftSquare1),
          elementNodes: [listNode1, listNode2]
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 13; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct error in parse result for expression: [1 2]', () => {
        const posStartLeftSquare = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartNum2 = new PositionTracker(3, 1, 4);
        const posStartRightSquare = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.R_SQUARE, posStartRightSquare),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected ',' or ']'`, posStartNum2,
                                              posStartRightSquare);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct error in parse result for expression: [1, 2, 3', () => {
        const posStartLeftSquare = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(1, 1, 2);
        const posStartComma1 = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartComma2 = new PositionTracker(5, 1, 6);
        const posStartNum3 = new PositionTracker(7, 1, 8);
        const posStartEof = new PositionTracker(8, 1, 9);
        const posEndEof = new PositionTracker(9, 1, 10);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.L_SQUARE, posStartLeftSquare),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.NUMBER, posStartNum3, 3),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected ',' or ']'`, posStartEof,
                                              posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 6; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('variable assignment tests', () => {
      it('should return correct AST for statement: variable = 1', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(9, 1, 10);
        const posStartNum1 = new PositionTracker(11, 1, 12);
        const posStartEof = new PositionTracker(12, 1, 13);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable'),
          node: numberNode1
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.NUMBER, posStartNum2, 3),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.POWER, posStartPower),
          createToken(TokenTypes.NUMBER, posStartNum3, 2),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 3)
        };
        const binaryMultExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 2)
        };
        const binaryPowerExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.POWER, posStartPower),
          leftChild: binaryMultExp,
          rightChild: numberNode3
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable'),
          node: binaryPowerExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 9; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.L_BRACKET, posStartOuterLeftBrack),
          createToken(TokenTypes.L_BRACKET, posStartInnerLeftBrack),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.NUMBER, posStartNum2, 3),
          createToken(TokenTypes.R_BRACKET, posStartInnerRightBrack),
          createToken(TokenTypes.POWER, posStartPower),
          createToken(TokenTypes.NUMBER, posStartNum3, 2),
          createToken(TokenTypes.R_BRACKET, posStartOuterRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 3)
        };
        const binaryMultExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 2)
        };
        const binaryPowerExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.POWER, posStartPower),
          leftChild: binaryMultExp,
          rightChild: numberNode3
        };

        const unaryExp: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          node: binaryPowerExp
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable'),
          node: unaryExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 12; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.NUMBER, posStartNum2, 10),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.NUMBER, posStartNum3, 2),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 10)
        };
        const varAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'x'),
          node: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 2)
        };
        const binaryMultiplyExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply),
          leftChild: varAssignNode,
          rightChild: numberNode3
        };

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: binaryMultiplyExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 9; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: x = "some string"', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(2, 1, 3);
        const posStartString = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(17, 1, 18);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.STRING, posStartString, 'some string'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const stringNode: ASTNode = {
          nodeType: NodeTypes.STRING,
          token: createToken(TokenTypes.STRING, posStartString, 'some string')
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'x'),
          node: stringNode
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct error in parse result for expression: x =', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(2, 1, 3);
        const posStartEof = new PositionTracker(3, 1, 4);
        const posEndEof = new PositionTracker(4, 1, 5);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected a number, identifier, '+', '-', '(', ` +
                                             `'[' or 'NOT'`, posStartEof, posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.NUMBER, posStartNum2, 10),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.NUMBER, posStartNum3, 2),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const varAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'x')
        };
        const currentAst: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode1,
          rightChild: varAccessNode
        };
        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1),
          elementNodes: [currentAst]
        };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/', '^', '==', '<', ` +
                                             `'>', '<=', '>=', 'AND' or 'OR'`, posStartEquals,
                                             posEndEquals);

        let expected = new ParseResult();
        expected.success(listNode);
        expected.failure(error);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
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
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack1),
          createToken(TokenTypes.NUMBER, posStartNum, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVariable1, 'x'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack1),
          createToken(TokenTypes.MULTIPLY, posStartMultiply),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack2),
          createToken(TokenTypes.IDENTIFIER, posStartVariable2, 'y'),
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.IDENTIFIER, posStartVariable3, 'z'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack2),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum, 1)
        };
        const xVarAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable1, 'x')
        };
        const binaryPlusExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode,
          rightChild: xVarAccessNode
        };

        const yVarAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable2, 'y')
        };
        const zVarAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable3, 'z')
        };
        const binaryMinusExp: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          leftChild: yVarAccessNode,
          rightChild: zVarAccessNode
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply),
          leftChild: binaryPlusExp,
          rightChild: binaryMinusExp
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 11; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: x = y', () => {
        const posStartVariable1 = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(2, 1, 3);
        const posStartVariable2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVariable1, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.IDENTIFIER, posStartVariable2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const yVarAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable2, 'y')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable1, 'x'),
          node: yVarAccessNode
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: -variable', () => {
        const posStartMinus = new PositionTracker(0, 1, 1);
        const posStartVariable = new PositionTracker(1, 1, 2);
        const posStartEof = new PositionTracker(9, 1, 10);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.MINUS, posStartMinus),
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const varAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'variable')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.MINUS, posStartMinus),
          node: varAccessNode
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct error in parse result for expression: x y', () => {
        const posStartVariable1 = new PositionTracker(0, 1, 1);
        const posStartVariable2 = new PositionTracker(2, 1, 3);
        const posStartEof = new PositionTracker(3, 1, 4);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVariable1, 'x'),
          createToken(TokenTypes.IDENTIFIER, posStartVariable2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const xVarAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable1, 'x')
        };
        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable1, 'x'),
          elementNodes: [xVarAccessNode]
        };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/', '^', '==', '<', ` +
                                             `'>', '<=', '>=', 'AND' or 'OR'`, posStartVariable2,
                                             posStartEof);

        let expected = new ParseResult();
        expected.success(listNode);
        expected.failure(error);

        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('logical operator tests', () => {
      it('should return correct AST for statement: 1 == 1', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartEquality = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.EQUALITY, posStartEquality),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.EQUALITY, posStartEquality),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: 10 > 1', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartGThan = new PositionTracker(3, 1, 4);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 10),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 10)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN, posStartGThan),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: 1 < 2', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartLThan = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(4, 1, 5);
        const posStartEof = new PositionTracker(5, 1, 6);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.L_THAN, posStartLThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN, posStartLThan),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: 1 >= 1', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartGThanEq = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.G_THAN_EQ, posStartGThanEq),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN_EQ, posStartGThanEq),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: 1 <= 1', () => {
        const posStartNum1 = new PositionTracker(0, 1, 1);
        const posStartLThanEq = new PositionTracker(2, 1, 3);
        const posStartNum2 = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.L_THAN_EQ, posStartLThanEq),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN_EQ, posStartLThanEq),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: TRUE AND FALSE', () => {
        const posStartTrue = new PositionTracker(0, 1, 1);
        const posStartAnd = new PositionTracker(5, 1, 6);
        const posStartFalse = new PositionTracker(9, 1, 10);
        const posStartEof = new PositionTracker(14, 1, 15);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const boolAccessNode1: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE')
        };
        const boolAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          leftChild: boolAccessNode1,
          rightChild: boolAccessNode2
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: TRUE OR FALSE', () => {
        const posStartTrue = new PositionTracker(0, 1, 1);
        const posStartOr = new PositionTracker(5, 1, 6);
        const posStartFalse = new PositionTracker(8, 1, 9);
        const posStartEof = new PositionTracker(13, 1, 14);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.KEYWORD, posStartOr, 'OR'),
          createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const boolAccessNode1: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE')
        };
        const boolAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartOr, 'OR'),
          leftChild: boolAccessNode1,
          rightChild: boolAccessNode2
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: NOT TRUE AND FALSE', () => {
        const posStartNot = new PositionTracker(0, 1, 1);
        const posStartTrue = new PositionTracker(4, 1, 5);
        const posStartAnd = new PositionTracker(9, 1, 10);
        const posStartFalse = new PositionTracker(13, 1, 14);
        const posStartEof = new PositionTracker(14, 1, 15);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartNot, 'NOT'),
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const boolAccessNode1: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE')
        };
        const boolAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE')
        };
        const boolAndExpr: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          leftChild: boolAccessNode1,
          rightChild: boolAccessNode2
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartNot, 'NOT'),
          node: boolAndExpr
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: var = NOT TRUE AND ((10 > 1) OR (5 < x))', () => {
        const posStartVar = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(4, 1, 5);
        const posStartNot = new PositionTracker(6, 1, 7);
        const posStartTrue = new PositionTracker(10, 1, 11);
        const posStartAnd = new PositionTracker(15, 1, 16);
        const posStartLeftBrack1 = new PositionTracker(19, 1, 20);
        const posStartLeftBrack2 = new PositionTracker(20, 1, 21);
        const posStartNum1 = new PositionTracker(21, 1, 22);
        const posStartGThan = new PositionTracker(24, 1, 25);
        const posStartNum2 = new PositionTracker(26, 1, 27);
        const posStartRightBrack1 = new PositionTracker(27, 1, 28);
        const posStartOr = new PositionTracker(29, 1, 30);
        const posStartLeftBrack3 = new PositionTracker(32, 1, 33);
        const posStartNum3 = new PositionTracker(33, 1, 34);
        const posStartLThan = new PositionTracker(35, 1, 36);
        const posStartVarX = new PositionTracker(37, 1, 38);
        const posStartRightBrack2 = new PositionTracker(38, 1, 39);
        const posStartRightBrack3 = new PositionTracker(39, 1, 40);
        const posStartEof = new PositionTracker(40, 1, 41);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVar, 'var'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.KEYWORD, posStartNot, 'NOT'),
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack1),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack2),
          createToken(TokenTypes.NUMBER, posStartNum1, 10),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack1),
          createToken(TokenTypes.KEYWORD, posStartOr, 'OR'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack3),
          createToken(TokenTypes.NUMBER, posStartNum3, 5),
          createToken(TokenTypes.L_THAN, posStartLThan),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack2),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack3),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 10)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 1)
        };
        const firstCondExpr: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN, posStartGThan),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 5)
        };
        const varXAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x')
        };
        const secondCondExpr: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN, posStartLThan),
          leftChild: numberNode3,
          rightChild: varXAccessNode
        };

        const orExpr: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartOr, 'OR'),
          leftChild: firstCondExpr,
          rightChild: secondCondExpr
        };

        const trueAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE')
        };
        const andExpr: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          leftChild: trueAccessNode,
          rightChild: orExpr
        };

        const notExpr: ASTNode = {
          nodeType: NodeTypes.UNARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartNot, 'NOT'),
          node: andExpr
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVar, 'var'),
          node: notExpr
        };

        let expected = new ParseResult();
        expected = expected.success(ast);

        for (let i = 0; i < 18; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement (not keywords): true and false', () => {
        const posStartTrue = new PositionTracker(0, 1, 1);
        const posStartAnd = new PositionTracker(5, 1, 6);
        const posEndAnd = new PositionTracker(6, 1, 7);
        const posStartFalse = new PositionTracker(9, 1, 10);
        const posStartEof = new PositionTracker(14, 1, 15);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartTrue, 'true'),
          createToken(TokenTypes.IDENTIFIER, posStartAnd, 'and'),
          createToken(TokenTypes.IDENTIFIER, posStartFalse, 'false'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const trueNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartTrue, 'true')
        };
        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartTrue, 'true'),
          elementNodes: [trueNode]
        };
        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/', '^', '==', '<', ` +
                                             `'>', '<=', '>=', 'AND' or 'OR'`, posStartAnd,
                                             posEndAnd);

        let expected = new ParseResult();
        expected.success(listNode);
        expected.failure(error);

        expected.registerAdvancement();

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: TRUE AND (var = FALSE)', () => {
        const posStartTrue = new PositionTracker(0, 1, 1);
        const posStartAnd = new PositionTracker(5, 1, 6);
        const posStartLeftBrack = new PositionTracker(9, 1, 10);
        const posStartVar = new PositionTracker(10, 1, 11);
        const posStartEquals = new PositionTracker(14, 1, 15);
        const posStartFalse = new PositionTracker(16, 1, 17);
        const posStartRightBrack = new PositionTracker(21, 1, 22);
        const posStartEof = new PositionTracker(22, 1, 23);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVar, 'var'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const falseNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartFalse, 'FALSE')
        };
        const varAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVar, 'var'),
          node: falseNode
        };

        const trueNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.KEYWORD, posStartAnd, 'AND'),
          leftChild: trueNode,
          rightChild: varAssignNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('if, elif and else statement tests', () => {
      it('should return correct AST for statement: if 1 > 2 then 1 + 1', () => {
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartGThan = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartThen = new PositionTracker(9, 1, 10);
        const posStartNum3 = new PositionTracker(14, 1, 15);
        const posStartPlus = new PositionTracker(16, 1, 17);
        const posStartNum4 = new PositionTracker(18, 1, 19);
        const posStartEof = new PositionTracker(23, 1, 24);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const compareNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN, posStartGThan),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 1)
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1)
        };
        const addNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode3,
          rightChild: numberNode4
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.IFSTATEMENT,
          token: createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          cases: [[compareNode, addNode]],
          elseCase: null
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: if 1 > 2 then 1 + 1 elif x == y then 1', () => {
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartGThan = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartThen = new PositionTracker(9, 1, 10);
        const posStartNum3 = new PositionTracker(14, 1, 15);
        const posStartPlus = new PositionTracker(16, 1, 17);
        const posStartNum4 = new PositionTracker(18, 1, 19);
        const posStartElif = new PositionTracker(20, 1, 21);
        const posStartVarX = new PositionTracker(25, 1, 26);
        const posStartEquality = new PositionTracker(27, 1, 28);
        const posStartVarY = new PositionTracker(30, 1, 31);
        const posStartThen2 = new PositionTracker(32, 1, 33);
        const posStartNum5 = new PositionTracker(37, 1, 38);
        const posStartEof = new PositionTracker(42, 1, 43);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.KEYWORD, posStartElif, 'elif'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALITY, posStartEquality),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.KEYWORD, posStartThen2, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum5, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const greaterThanNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN, posStartGThan),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 1)
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1)
        };
        const addNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode3,
          rightChild: numberNode4
        };

        const varAccessNode1: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x')
        };
        const varAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')
        };
        const equalityNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.EQUALITY, posStartEquality),
          leftChild: varAccessNode1,
          rightChild: varAccessNode2
        };

        const numberNode5: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum5, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.IFSTATEMENT,
          token: createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          cases: [[greaterThanNode, addNode], [equalityNode, numberNode5]],
          elseCase: null
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 14; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement with many elifs and an else at the end', () => {
        // Expression: if 1 > 2 then 1 + 1 elif x == y then 1 elif 1 < 2 then 2 elif x >= y then 0 else 1 + 1
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartGThan = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartThen = new PositionTracker(9, 1, 10);
        const posStartNum3 = new PositionTracker(14, 1, 15);
        const posStartPlus = new PositionTracker(16, 1, 17);
        const posStartNum4 = new PositionTracker(18, 1, 19);
        const posStartElif = new PositionTracker(20, 1, 21);
        const posStartVarX = new PositionTracker(25, 1, 26);
        const posStartEquality = new PositionTracker(27, 1, 28);
        const posStartVarY = new PositionTracker(30, 1, 31);
        const posStartThen2 = new PositionTracker(32, 1, 33);
        const posStartNum5 = new PositionTracker(37, 1, 38);
        const posStartElif2 = new PositionTracker(39, 1, 40);
        const posStartNum6 = new PositionTracker(44, 1, 45);
        const posStartLThan = new PositionTracker(46, 1, 47);
        const posStartNum7 = new PositionTracker(48, 1, 49);
        const posStartThen3 = new PositionTracker(50, 1, 51);
        const posStartNum8 = new PositionTracker(55, 1, 56);
        const posStartElif3 = new PositionTracker(57, 1, 58);
        const posStartVarX2 = new PositionTracker(62, 1, 63);
        const posStartGThanEqual = new PositionTracker(64, 1, 65);
        const posStartVarY2 = new PositionTracker(67, 1, 68);
        const posStartThen4 = new PositionTracker(69, 1, 70);
        const posStartNum9 = new PositionTracker(74, 1, 75);
        const posStartElse = new PositionTracker(76, 1, 77);
        const posStartNum10 = new PositionTracker(81, 1, 82);
        const posStartPlus2 = new PositionTracker(83, 1, 84);
        const posStartNum11 = new PositionTracker(85, 1, 86);
        const posStartEof = new PositionTracker(90, 1, 91);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.KEYWORD, posStartElif, 'elif'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALITY, posStartEquality),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.KEYWORD, posStartThen2, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum5, 1),
          createToken(TokenTypes.KEYWORD, posStartElif2, 'elif'),
          createToken(TokenTypes.NUMBER, posStartNum6, 1),
          createToken(TokenTypes.L_THAN, posStartLThan),
          createToken(TokenTypes.NUMBER, posStartNum7, 2),
          createToken(TokenTypes.KEYWORD, posStartThen3, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum8, 2),
          createToken(TokenTypes.KEYWORD, posStartElif3, 'elif'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.G_THAN_EQ, posStartGThanEqual),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.KEYWORD, posStartThen4, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum9, 0),
          createToken(TokenTypes.KEYWORD, posStartElse, 'else'),
          createToken(TokenTypes.NUMBER, posStartNum10, 1),
          createToken(TokenTypes.PLUS, posStartPlus2),
          createToken(TokenTypes.NUMBER, posStartNum11, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const greaterThanNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN, posStartGThan),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 1)
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1)
        };
        const addNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: numberNode3,
          rightChild: numberNode4
        };

        const varAccessNode1: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x')
        };
        const varAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')
        };
        const equalityNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.EQUALITY, posStartEquality),
          leftChild: varAccessNode1,
          rightChild: varAccessNode2
        };

        const numberNode5: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum5, 1)
        };

        const numberNode6: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum6, 1)
        };
        const numberNode7: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum7, 2)
        };
        const lessThanNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN, posStartLThan),
          leftChild: numberNode6,
          rightChild: numberNode7
        };

        const numberNode8: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum8, 2)
        };

        const varAccessNode3: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x')
        };
        const varAccessNode4: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y')
        };
        const gThanEqualNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN_EQ, posStartGThanEqual),
          leftChild: varAccessNode3,
          rightChild: varAccessNode4
        };

        const numberNode9: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum9, 0)
        };

        const numberNode10: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum10, 1)
        };
        const numberNode11: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum11, 1)
        };
        const addNode2: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus2),
          leftChild: numberNode10,
          rightChild: numberNode11
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.IFSTATEMENT,
          token: createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          cases: [[greaterThanNode, addNode], [equalityNode, numberNode5],
                  [lessThanNode, numberNode8], [gThanEqualNode, numberNode9]],
          elseCase: addNode2
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 30; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing 'then' in parse result for expression: if 1 == 1 1`, () => {
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartEquality = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(8, 1, 9);
        const posStartNum3 = new PositionTracker(10, 1, 11);
        const posEndNum3 = new PositionTracker(11, 1, 12);
        const posStartEnd = new PositionTracker(12, 1, 13);
        const posStartEof = new PositionTracker(15, 1, 16);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.EQUALITY, posStartEquality),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.KEYWORD, posStartEnd, 'end'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected 'then' keyword`, posStartNum3,
                                              posEndNum3);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing 'then' in parse result for expression: if 1 == 1 then 1 elif 1 > 0 1 + 1`, () => {
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartEquality = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(8, 1, 9);
        const posStartThen = new PositionTracker(10, 1, 11);
        const posStartNum3 = new PositionTracker(15, 1, 16);
        const posStartElif = new PositionTracker(17, 1, 18);
        const posStartNum4 = new PositionTracker(22, 1, 23);
        const posStartGThan = new PositionTracker(24, 1, 25);
        const posStartNum5 = new PositionTracker(26, 1, 27);
        const posStartNum6 = new PositionTracker(28, 1, 29);
        const posEndNum6 = new PositionTracker(29, 1, 30);
        const posStartPlus = new PositionTracker(30, 1, 31);
        const posStartNum7 = new PositionTracker(32, 1, 33);
        const posStartEof = new PositionTracker(37, 1, 38);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.EQUALITY, posStartEquality),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.KEYWORD, posStartElif, 'elif'),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNum5, 0),
          createToken(TokenTypes.NUMBER, posStartNum6, 1),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum7, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected 'then' keyword`, posStartNum6,
                                              posEndNum6);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 10; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('for/while loop tests', () => {
      it('should return correct AST for statement: for x = 1 to 10 loop 10', () => {
        const posStartFor = new PositionTracker(0, 1, 1);
        const posStartVarX = new PositionTracker(4, 1, 5);
        const posStartEquals = new PositionTracker(6, 1, 7);
        const posStartNum1 = new PositionTracker(8, 1, 9);
        const posStartTo = new PositionTracker(10, 1, 11);
        const posStartNum2 = new PositionTracker(13, 1, 14);
        const posStartLoop = new PositionTracker(16, 1, 17);
        const posStartNum3 = new PositionTracker(21, 1, 22);
        const posStartEof = new PositionTracker(23, 1, 24);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.KEYWORD, posStartTo, 'to'),
          createToken(TokenTypes.NUMBER, posStartNum2, 10),
          createToken(TokenTypes.KEYWORD, posStartLoop, 'loop'),
          createToken(TokenTypes.NUMBER, posStartNum3, 10),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const startValueNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const endValueNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 10)
        };
        const bodyNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 10)
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.FORLOOP,
          token: createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          varNameToken: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          startValueNode: startValueNode,
          endValueNode: endValueNode,
          stepValueNode: null,
          bodyNode: bodyNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: for x = 1 to 10 step 2 loop 10', () => {
        const posStartFor = new PositionTracker(0, 1, 1);
        const posStartVarX = new PositionTracker(4, 1, 5);
        const posStartEquals = new PositionTracker(6, 1, 7);
        const posStartNum1 = new PositionTracker(8, 1, 9);
        const posStartTo = new PositionTracker(10, 1, 11);
        const posStartNum2 = new PositionTracker(13, 1, 14);
        const posStartStep = new PositionTracker(16, 1, 17);
        const posStartNum3 = new PositionTracker(21, 1, 22);
        const posStartLoop = new PositionTracker(23, 1, 24);
        const posStartNum4 = new PositionTracker(28, 1, 29);
        const posStartEof = new PositionTracker(30, 1, 31);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.KEYWORD, posStartTo, 'to'),
          createToken(TokenTypes.NUMBER, posStartNum2, 10),
          createToken(TokenTypes.KEYWORD, posStartStep, 'step'),
          createToken(TokenTypes.NUMBER, posStartNum3, 2),
          createToken(TokenTypes.KEYWORD, posStartLoop, 'loop'),
          createToken(TokenTypes.NUMBER, posStartNum4, 10),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const startValueNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const endValueNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 10)
        };
        const stepValueNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 2)
        };
        const bodyNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 10)
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.FORLOOP,
          token: createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          varNameToken: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          startValueNode: startValueNode,
          endValueNode: endValueNode,
          stepValueNode: stepValueNode,
          bodyNode: bodyNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 10; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: while TRUE loop 1', () => {
        const posStartWhile = new PositionTracker(0, 1, 1);
        const posStartTrue = new PositionTracker(6, 1, 7);
        const posStartLoop = new PositionTracker(11, 1, 12);
        const posStartNum = new PositionTracker(16, 1, 17);
        const posStartEof = new PositionTracker(17, 1, 18);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartWhile, 'while'),
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.KEYWORD, posStartLoop, 'loop'),
          createToken(TokenTypes.NUMBER, posStartNum, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const trueNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
        };
        const numberNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum, 1)
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.WHILELOOP,
          token: createToken(TokenTypes.KEYWORD, posStartWhile, 'while'),
          conditionNode: trueNode,
          bodyNode: numberNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing 'to' in parse result for expression: for x = 1 10 loop 10`, () => {
        const posStartFor = new PositionTracker(0, 1, 1);
        const posStartVarX = new PositionTracker(4, 1, 5);
        const posStartEquals = new PositionTracker(6, 1, 7);
        const posStartNum1 = new PositionTracker(8, 1, 9);
        const posStartNum2 = new PositionTracker(10, 1, 11);
        const posEndNum2 = new PositionTracker(11, 1, 12);
        const posStartLoop = new PositionTracker(13, 1, 14);
        const posStartNum3 = new PositionTracker(18, 1, 19);
        const posStartEof = new PositionTracker(20, 1, 21);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.NUMBER, posStartNum2, 10),
          createToken(TokenTypes.KEYWORD, posStartLoop, 'loop'),
          createToken(TokenTypes.NUMBER, posStartNum3, 10),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected 'to' keyword`, posStartNum2,
                                              posEndNum2);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing 'loop' in parse result for expression: for x = 1 to 10 10`, () => {
        const posStartFor = new PositionTracker(0, 1, 1);
        const posStartVarX = new PositionTracker(4, 1, 5);
        const posStartEquals = new PositionTracker(6, 1, 7);
        const posStartNum1 = new PositionTracker(8, 1, 9);
        const posStartTo = new PositionTracker(10, 1, 11);
        const posStartNum2 = new PositionTracker(13, 1, 14);
        const posStartNum3 = new PositionTracker(16, 1, 17);
        const posEndNum3 = new PositionTracker(17, 1, 18);
        const posStartEof = new PositionTracker(18, 1, 19);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.KEYWORD, posStartTo, 'to'),
          createToken(TokenTypes.NUMBER, posStartNum2, 10),
          createToken(TokenTypes.NUMBER, posStartNum3, 10),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected 'loop' keyword`, posStartNum3,
                                              posEndNum3);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 6; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing 'loop' in parse result for expression: while TRUE 1`, () => {
        const posStartWhile = new PositionTracker(0, 1, 1);
        const posStartTrue = new PositionTracker(6, 1, 7);
        const posStartNum = new PositionTracker(11, 1, 12);
        const posEndNum = new PositionTracker(12, 1, 13);
        const posStartEof = new PositionTracker(13, 1, 14);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartWhile, 'while'),
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.NUMBER, posStartNum, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected 'loop' keyword`, posStartNum,
                                              posEndNum);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('function definition and calls tests', () => {
      it('should return correct AST for statement: function one() begin 1', () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartRightBrack = new PositionTracker(13, 1, 14);
        const posStartBegin = new PositionTracker(15, 1, 16);
        const posStartNum = new PositionTracker(21, 1, 22);
        const posStartEof = new PositionTracker(22, 1, 23);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'one'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.NUMBER, posStartNum, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum, 1)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.FUNCTIONDEF,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          varNameToken: createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'one'),
          argNameTokens: [],
          bodyNode: numberNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 6; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: function add(x, y) begin x + y', () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartVarX = new PositionTracker(13, 1, 14);
        const posStartComma = new PositionTracker(14, 1, 15);
        const posStartVarY = new PositionTracker(16, 1, 17);
        const posStartRightBrack = new PositionTracker(17, 1, 18);
        const posStartBegin = new PositionTracker(19, 1, 20);
        const posStartVarX2 = new PositionTracker(25, 1, 26);
        const posStartPlus = new PositionTracker(27, 1, 28);
        const posStartVarY2 = new PositionTracker(29, 1, 30);
        const posStartEof = new PositionTracker(30, 1, 31);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const varXNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x')
        };
        const varYNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y')
        };
        const bodyNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: varXNode,
          rightChild: varYNode
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.FUNCTIONDEF,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          varNameToken: createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          argNameTokens: [createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
                          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')],
          bodyNode: bodyNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 11; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      // // Anonymous function support.
      it('should return correct AST for statement: function (x, y) begin x + y', () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartLeftBrack = new PositionTracker(9, 1, 10);
        const posStartVarX = new PositionTracker(10, 1, 11);
        const posStartComma = new PositionTracker(11, 1, 12);
        const posStartVarY = new PositionTracker(13, 1, 14);
        const posStartRightBrack = new PositionTracker(14, 1, 15);
        const posStartBegin = new PositionTracker(16, 1, 17);
        const posStartVarX2 = new PositionTracker(22, 1, 23);
        const posStartPlus = new PositionTracker(24, 1, 25);
        const posStartVarY2 = new PositionTracker(26, 1, 27);
        const posStartEof = new PositionTracker(27, 1, 28);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const varXNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x')
        };
        const varYNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y')
        };
        const bodyNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: varXNode,
          rightChild: varYNode
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.FUNCTIONDEF,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          varNameToken: null,
          argNameTokens: [createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
                          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')],
          bodyNode: bodyNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 10; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: func = function (x, y) begin x + y', () => {
        const posStartVariable = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(5, 1, 6);
        const posStartFunction = new PositionTracker(7, 1, 8);
        const posStartLeftBrack = new PositionTracker(16, 1, 17);
        const posStartVarX = new PositionTracker(17, 1, 18);
        const posStartComma = new PositionTracker(18, 1, 19);
        const posStartVarY = new PositionTracker(20, 1, 21);
        const posStartRightBrack = new PositionTracker(21, 1, 22);
        const posStartBegin = new PositionTracker(23, 1, 24);
        const posStartVarX2 = new PositionTracker(29, 1, 30);
        const posStartPlus = new PositionTracker(31, 1, 32);
        const posStartVarY2 = new PositionTracker(33, 1, 34);
        const posStartEof = new PositionTracker(34, 1, 35);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVariable, 'func'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const varXNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x')
        };
        const varYNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y')
        };
        const bodyNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: varXNode,
          rightChild: varYNode
        };
        const functionDefNode: ASTNode = {
          nodeType: NodeTypes.FUNCTIONDEF,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          varNameToken: null,
          argNameTokens: [createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
                          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')],
          bodyNode: bodyNode
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVariable, 'func'),
          node: functionDefNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 12; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: func(x, y, z)', () => {
        const posStartFunc = new PositionTracker(0, 1, 1);
        const posStartLeftBrack = new PositionTracker(4, 1, 5);
        const posStartVarX = new PositionTracker(5, 1, 6);
        const posStartComma1 = new PositionTracker(6, 1, 7);
        const posStartVarY = new PositionTracker(8, 1, 9);
        const posStartComma2 = new PositionTracker(9, 1, 10);
        const posStartVarZ = new PositionTracker(11, 1, 12);
        const posStartRightBrack = new PositionTracker(12, 1, 13);
        const posStartEof = new PositionTracker(13, 1, 14);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.IDENTIFIER, posStartVarZ, 'z'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const funcNameNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func')
        };
        const xNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x')
        };
        const yNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')
        };
        const zNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarZ, 'z')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func'),
          nodeToCall: funcNameNode,
          argNodes: [xNode, yNode, zNode]
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: func(10, 1, 2)', () => {
        const posStartFunc = new PositionTracker(0, 1, 1);
        const posStartLeftBrack = new PositionTracker(4, 1, 5);
        const posStartNum1 = new PositionTracker(5, 1, 6);
        const posStartComma1 = new PositionTracker(7, 1, 8);
        const posStartNum2 = new PositionTracker(9, 1, 10);
        const posStartComma2 = new PositionTracker(10, 1, 11);
        const posStartNum3 = new PositionTracker(12, 1, 13);
        const posStartRightBrack = new PositionTracker(13, 1, 14);
        const posStartEof = new PositionTracker(14, 1, 15);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.NUMBER, posStartNum1, 10),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.NUMBER, posStartNum3, 2),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const funcNameNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func')
        };
        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 10)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 1)
        };
        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 2)
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func'),
          nodeToCall: funcNameNode,
          argNodes: [numberNode1, numberNode2, numberNode3]
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: func()', () => {
        const posStartFunc = new PositionTracker(0, 1, 1);
        const posStartLeftBrack = new PositionTracker(4, 1, 5);
        const posStartRightBrack = new PositionTracker(5, 1, 6);
        const posStartEof = new PositionTracker(6, 1, 7);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const funcNameNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func')
        };
        const ast: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartFunc, 'func'),
          nodeToCall: funcNameNode,
          argNodes: []
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for statement: sum = add(x, y)', () => {
        const posStartSum = new PositionTracker(0, 1, 1);
        const posStartEquals = new PositionTracker(4, 1, 5);
        const posStartAdd = new PositionTracker(6, 1, 7);
        const posStartLeftBrack = new PositionTracker(9, 1, 10);
        const posStartVarX = new PositionTracker(10, 1, 11);
        const posStartComma1 = new PositionTracker(11, 1, 12);
        const posStartVarY = new PositionTracker(13, 1, 14);
        const posStartRightBrack = new PositionTracker(14, 1, 15);
        const posStartEof = new PositionTracker(15, 1, 16);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartSum, 'sum'),
          createToken(TokenTypes.EQUALS, posStartEquals),
          createToken(TokenTypes.IDENTIFIER, posStartAdd, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const funcNameNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartAdd, 'add')
        };
        const xNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x')
        };
        const yNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')
        };
        const functionNode: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartAdd, 'add'),
          nodeToCall: funcNameNode,
          argNodes: [xNode, yNode]
        };

        const ast: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartSum, 'sum'),
          node: functionNode
        };

        let expected = new ParseResult();
        expected.success(ast);

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error expected '(' in parse result for expression: function add x, y) begin x + y`, () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartVarX = new PositionTracker(11, 1, 12);
        const posStartComma = new PositionTracker(12, 1, 13);
        const posStartVarY = new PositionTracker(14, 1, 15);
        const posStartRightBrack = new PositionTracker(15, 1, 16);
        const posStartBegin = new PositionTracker(17, 1, 18);
        const posStartVarX2 = new PositionTracker(23, 1, 24);
        const posStartPlus = new PositionTracker(25, 1, 26);
        const posStartVarY2 = new PositionTracker(27, 1, 28);
        const posStartEof = new PositionTracker(28, 1, 29);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected '('`, posStartVarX,
                                              posStartComma);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 2; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing ',' or ')' in parse result for expression: function add(x y) begin x + y`, () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartVarX = new PositionTracker(13, 1, 14);
        const posStartVarY = new PositionTracker(15, 1, 16);
        const posStartRightBrack = new PositionTracker(16, 1, 17);
        const posStartBegin = new PositionTracker(18, 1, 19);
        const posStartVarX2 = new PositionTracker(20, 1, 21);
        const posStartPlus = new PositionTracker(22, 1, 23);
        const posStartVarY2 = new PositionTracker(24, 1, 25);
        const posStartEof = new PositionTracker(25, 1, 26);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected ',' or ')'`, posStartVarY,
                                              posStartRightBrack);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing ',' or ')' in parse result for expression: function add(x, y begin x + y`, () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartVarX = new PositionTracker(13, 1, 14);
        const posStartComma = new PositionTracker(14, 1, 15);
        const posStartVarY = new PositionTracker(16, 1, 17);
        const posStartBegin = new PositionTracker(18, 1, 19);
        const posEndBegin = new PositionTracker(19, 1, 20);
        const posStartVarX2 = new PositionTracker(24, 1, 25);
        const posStartPlus = new PositionTracker(26, 1, 27);
        const posStartVarY2 = new PositionTracker(28, 1, 29);
        const posStartEof = new PositionTracker(29, 1, 30);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected ',' or ')'`, posStartBegin,
                                              posEndBegin);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 6; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error 'Expected identifier' in parse result for expression: function add(x, ) begin x + y`, () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartVarX = new PositionTracker(13, 1, 14);
        const posStartComma = new PositionTracker(14, 1, 15);
        const posStartRightBrack = new PositionTracker(16, 1, 17);
        const posEndRightBrack = new PositionTracker(17, 1, 18);
        const posStartBegin = new PositionTracker(18, 1, 19);
        const posStartVarX2 = new PositionTracker(24, 1, 25);
        const posStartPlus = new PositionTracker(26, 1, 27);
        const posStartVarY2 = new PositionTracker(28, 1, 29);
        const posStartEof = new PositionTracker(29, 1, 30);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected identifier`, posStartRightBrack,
                                              posEndRightBrack);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 5; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing 'begin' in parse result for expression: function add(x, y) x + y`, () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartVarX = new PositionTracker(13, 1, 14);
        const posStartComma = new PositionTracker(14, 1, 15);
        const posStartVarY = new PositionTracker(16, 1, 17);
        const posStartRightBrack = new PositionTracker(17, 1, 18);
        const posStartVarX2 = new PositionTracker(19, 1, 20);
        const posEndVarX2 = new PositionTracker(20, 1, 21);
        const posStartPlus = new PositionTracker(21, 1, 22);
        const posStartVarY2 = new PositionTracker(23, 1, 24);
        const posStartEof = new PositionTracker(24, 1, 25);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected 'begin' keyword or newline character`, posStartVarX2,
                                              posEndVarX2);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 7; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct expression error in parse result for expression: function add(x, y) begin`, () => {
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartVarX = new PositionTracker(13, 1, 14);
        const posStartComma = new PositionTracker(14, 1, 15);
        const posStartVarY = new PositionTracker(16, 1, 17);
        const posStartRightBrack = new PositionTracker(17, 1, 18);
        const posStartBegin = new PositionTracker(19, 1, 20);
        const posStartEof = new PositionTracker(20, 1, 21);
        const posEndEof = new PositionTracker(21, 1, 22);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected a number, identifier, '+', '-', '(', '['` +
                                             ` or 'NOT'`, posStartEof, posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 8; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error 'Expected identifier' in parse result for expression: add(x, )`, () => {
        const posStartFuncName = new PositionTracker(0, 1, 1);
        const posStartLeftBrack = new PositionTracker(3, 1, 4);
        const posStartVarX = new PositionTracker(4, 1, 5);
        const posStartComma = new PositionTracker(5, 1, 6);
        const posStartRightBrack = new PositionTracker(7, 1, 8);
        const posStartEof = new PositionTracker(8, 1, 9);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected a number, identifier, '+', '-', '(', '['` +
                                             ` or 'NOT'`, posStartRightBrack, posStartEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 4; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing ',' or ')' in parse result for expression: add(x y)`, () => {
        const posStartFuncName = new PositionTracker(0, 1, 1);
        const posStartLeftBrack = new PositionTracker(3, 1, 4);
        const posStartVarX = new PositionTracker(4, 1, 5);
        const posStartVarY = new PositionTracker(6, 1, 7);
        const posStartRightBrack = new PositionTracker(7, 1, 8);
        const posStartEof = new PositionTracker(8, 1, 9);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected ',' or ')'`, posStartVarY,
                                              posStartRightBrack);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 3; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should return correct error missing ',' or ')' in parse result for expression: add(x, y`, () => {
        const posStartFuncName = new PositionTracker(0, 1, 1);
        const posStartLeftBrack = new PositionTracker(3, 1, 4);
        const posStartVarX = new PositionTracker(4, 1, 5);
        const posStartComma = new PositionTracker(5, 1, 6);
        const posStartVarY = new PositionTracker(7, 1, 8);
        const posStartEof = new PositionTracker(8, 1, 9);
        const posEndEof = new PositionTracker(9, 1, 10);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected ',' or ')'`, posStartEof, posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 5; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    // Block code is having multiple lines inside a function or if/elif/else/for/while loops.
    describe('multi-lined code with no block code tests', () => {
      it('should create list of outputs for each line for a given multi-line code', () => {
        // code: function add(x, y) begin x + y\nif add(3, 2) > 2 then TRUE\n"string"
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack = new PositionTracker(12, 1, 13);
        const posStartVarX = new PositionTracker(13, 1, 14);
        const posStartComma = new PositionTracker(14, 1, 15);
        const posStartVarY = new PositionTracker(16, 1, 17);
        const posStartRightBrack = new PositionTracker(17, 1, 18);
        const posStartBegin = new PositionTracker(19, 1, 20);
        const posStartVarX2 = new PositionTracker(25, 1, 26);
        const posStartPlus = new PositionTracker(27, 1, 28);
        const posStartVarY2 = new PositionTracker(29, 1, 30);
        const posStartNewline1 = new PositionTracker(30, 1, 31);
        const posStartIf = new PositionTracker(31, 2, 1);
        const posStartFuncCall = new PositionTracker(34, 2, 4);
        const posStartLeftBrack2 = new PositionTracker(37, 2, 7);
        const posStartNumber1 = new PositionTracker(38, 2, 8);
        const posStartComma2 = new PositionTracker(39, 2, 9);
        const posStartNumber2 = new PositionTracker(41, 2, 11);
        const posStartRightBrack2 = new PositionTracker(42, 2, 12);
        const posStartGThan = new PositionTracker(44, 2, 14);
        const posStartNumber3 = new PositionTracker(46, 2, 16);
        const posStartThen = new PositionTracker(48, 2, 18);
        const posStartTrue = new PositionTracker(53, 2, 23);
        const posStartNewline2 = new PositionTracker(57, 2, 27);
        const posStartString = new PositionTracker(58, 3, 1);
        const posStartEof = new PositionTracker(64, 3, 9);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.COMMA, posStartComma),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack),
          createToken(TokenTypes.KEYWORD, posStartBegin, 'begin'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncCall, 'add'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack2),
          createToken(TokenTypes.NUMBER, posStartNumber1, 3),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.NUMBER, posStartNumber2, 2),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack2),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNumber3, 2),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE'),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.STRING, posStartString, 'string'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const varX2Node: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x')
        };
        const varY2Node: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y')
        };
        const bodyNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: varX2Node,
          rightChild: varY2Node
        };

        const functionDefNode: ASTNode = {
          nodeType: NodeTypes.FUNCTIONDEF,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          varNameToken: createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'add'),
          argNameTokens: [createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
                          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y')],
          bodyNode: bodyNode
        };

        const funcNameNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall, 'add')
        };
        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNumber1, 3)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNumber2, 2)
        };
        const functionCallNode: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall, 'add'),
          nodeToCall: funcNameNode,
          argNodes: [numberNode1, numberNode2]
        };
        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNumber3, 2)
        };
        const compareNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN, posStartGThan),
          leftChild: functionCallNode,
          rightChild: numberNode3
        };

        const trueNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.KEYWORD, posStartTrue, 'TRUE')
        };
        const ifNode: ASTNode = {
          nodeType: NodeTypes.IFSTATEMENT,
          token: createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          cases: [[compareNode, trueNode]],
          elseCase: null
        };

        const stringNode: ASTNode = {
          nodeType: NodeTypes.STRING,
          token: createToken(TokenTypes.STRING, posStartString, 'string')
        };

        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          elementNodes: [functionDefNode, ifNode, stringNode]
        };

        let expected = new ParseResult();
        expected.success(listNode);

        for (let i = 0; i < 25; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should generate correct parse tree if multi-line code has multiple newlines', () => {
        // code: x = 1\n\n\ny = 1
        const posStartVarX = new PositionTracker(0, 1, 1);
        const posStartEquals1 = new PositionTracker(2, 1, 3);
        const posStartNum1 = new PositionTracker(4, 1, 5);
        const posStartNewline1 = new PositionTracker(5, 1, 6);
        const posStartNewline2 = new PositionTracker(6, 2, 1);
        const posStartNewline3 = new PositionTracker(7, 3, 1);
        const posStartVarY = new PositionTracker(8, 4, 1);
        const posStartEquals2 = new PositionTracker(10, 4, 3);
        const posStartNum2 = new PositionTracker(12, 4, 5);
        const posStartEof = new PositionTracker(13, 4, 14);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.NEWLINE, posStartNewline3),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.NUMBER, posStartNum2, 1),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          node: numberNode1
        };

        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 1)
        };
        const varYAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          node: numberNode2
        };

        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          elementNodes: [varXAssignNode, varYAssignNode]
        }

        let expected = new ParseResult();
        expected.success(listNode);

        for (let i = 0; i < 9; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should generate correct error for erroneous line in multi-line code', () => {
        // code: x = 1\ny = 2\nfinal = x z
        const posStartVarX = new PositionTracker(0, 1, 1);
        const posStartEquals1 = new PositionTracker(2, 1, 3);
        const posStartNum1 = new PositionTracker(4, 1, 5);
        const posStartNewline1 = new PositionTracker(5, 1, 6);
        const posStartVarY = new PositionTracker(6, 2, 1);
        const posStartEquals2 = new PositionTracker(8, 2, 3);
        const posStartNum2 = new PositionTracker(10, 2, 5);
        const posStartNewline2 = new PositionTracker(11, 2, 6);
        const posStartVarFinal = new PositionTracker(12, 3, 1);
        const posStartEquals3 = new PositionTracker(18, 3, 7);
        const posStartVarX2 = new PositionTracker(20, 3, 9);
        const posStartVarZ = new PositionTracker(22, 3, 11);
        const posStartEof = new PositionTracker(23, 3, 12);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.IDENTIFIER, posStartVarFinal, 'final'),
          createToken(TokenTypes.EQUALS, posStartEquals3),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.IDENTIFIER, posStartVarZ, 'z'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1),
        };
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          node: numberNode1
        };

        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2),
        };
        const varYAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          node: numberNode2
        };

        const varXAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x')
        };
        const varFinalAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarFinal, 'final'),
          node: varXAccessNode
        };

        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          elementNodes: [varXAssignNode, varYAssignNode, varFinalAssignNode]
        }

        const error = new InvalidSyntaxError(`Expected '+', '-', '*', '/', '^', '==', '<', '>',` +
                                             ` '<=', '>=', 'AND' or 'OR'`, posStartVarZ,
                                             posStartEof);

        let expected = new ParseResult();
        expected.success(listNode);
        expected.failure(error);

        for (let i = 0; i < 11; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });

    describe('multi-lined code with block code tests', () => {
      it('should produce correct AST for if statement with block code', () => {
        // code: if 1 > 0 then\nx = 0\ny = 1\nend
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartGThan = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartThen = new PositionTracker(9, 1, 10);
        const posStartNewline1 = new PositionTracker(13, 1, 14);
        const posStartVarX = new PositionTracker(14, 2, 1);
        const posStartEquals1 = new PositionTracker(16, 2, 3);
        const posStartNum3 = new PositionTracker(18, 2, 5);
        const posStartNewline2 = new PositionTracker(19, 2, 6);
        const posStartVarY = new PositionTracker(20, 3, 1);
        const posStartEquals2 = new PositionTracker(22, 3, 3);
        const posStartNum4 = new PositionTracker(24, 3, 5);
        const posStartNewline3 = new PositionTracker(25, 3, 6);
        const posStartEnd = new PositionTracker(26, 4, 1);
        const posStartEof = new PositionTracker(29, 4, 4);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.G_THAN, posStartGThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 0),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum3, 0),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline3),
          createToken(TokenTypes.KEYWORD, posStartEnd, 'end'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1),
        }
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 0),
        }
        const compareNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.G_THAN, posStartGThan),
          leftChild: numberNode1,
          rightChild: numberNode2
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 0),
        };
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          node: numberNode3
        }
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1),
        };
        const varYAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          node: numberNode4
        }
        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          elementNodes: [varXAssignNode, varYAssignNode]
        };
        const ifNode: ASTNode = {
          nodeType: NodeTypes.IFSTATEMENT,
          token: createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          cases: [[compareNode, listNode]],
          elseCase: null
        };

        let expected = new ParseResult();
        expected.success(ifNode);

        for (let i = 0; i < 15; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should produce correct AST for if and else statements with block code', () => {
        // code: if 1 < 0 then\nx = 0\ny = 1\nelse\nx = 100\nend
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartLThan = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartThen = new PositionTracker(9, 1, 10);
        const posStartNewline1 = new PositionTracker(13, 1, 14);
        const posStartVarX = new PositionTracker(14, 2, 1);
        const posStartEquals1 = new PositionTracker(16, 2, 3);
        const posStartNum3 = new PositionTracker(18, 2, 5);
        const posStartNewline2 = new PositionTracker(19, 2, 6);
        const posStartVarY = new PositionTracker(20, 3, 1);
        const posStartEquals2 = new PositionTracker(22, 3, 3);
        const posStartNum4 = new PositionTracker(24, 3, 5);
        const posStartNewline3 = new PositionTracker(25, 3, 6);
        const posStartElse = new PositionTracker(26, 4, 1);
        const posStartNewline4 = new PositionTracker(30, 4, 5);
        const posStartVarX2 = new PositionTracker(31, 5, 1);
        const posStartEquals3 = new PositionTracker(33, 5, 3);
        const posStartNum5 = new PositionTracker(35, 5, 5);
        const posStartNewline5 = new PositionTracker(38, 5, 8);
        const posStartEnd = new PositionTracker(39, 6, 1);
        const posStartEof = new PositionTracker(42, 6, 4);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.L_THAN, posStartLThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 0),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum3, 0),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline3),
          createToken(TokenTypes.KEYWORD, posStartElse, 'else'),
          createToken(TokenTypes.NEWLINE, posStartNewline4),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals3),
          createToken(TokenTypes.NUMBER, posStartNum5, 100),
          createToken(TokenTypes.NEWLINE, posStartNewline5),
          createToken(TokenTypes.KEYWORD, posStartEnd, 'end'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        }
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 0)
        }
        const compareNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN, posStartLThan),
          leftChild: numberNode1,
          rightChild: numberNode2,
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 0)
        };
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          node: numberNode3
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1)
        };
        const varYAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          node: numberNode4
        };
        const ifListNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          elementNodes: [varXAssignNode, varYAssignNode]
        };

        const numberNode5: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum5, 100)
        };
        const varX2AssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          node: numberNode5
        };
        const elseListNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          elementNodes: [varX2AssignNode]
        };
        const ifNode: ASTNode = {
          nodeType: NodeTypes.IFSTATEMENT,
          token: createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          cases: [[compareNode, ifListNode]],
          elseCase: elseListNode
        };

        let expected = new ParseResult();
        expected.success(ifNode);

        for (let i = 0; i < 21; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should produce correct AST for if, elif and else statements with block code', () => {
        // code: if 1 < 0 then\nx = 0\ny = 1\nelif 2 < 3 then\n1\nelse\nx = 100\nend
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartLThan = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartThen = new PositionTracker(9, 1, 10);
        const posStartNewline1 = new PositionTracker(13, 1, 14);
        const posStartVarX = new PositionTracker(14, 2, 1);
        const posStartEquals1 = new PositionTracker(16, 2, 3);
        const posStartNum3 = new PositionTracker(18, 2, 5);
        const posStartNewline2 = new PositionTracker(19, 2, 6);
        const posStartVarY = new PositionTracker(20, 3, 1);
        const posStartEquals2 = new PositionTracker(22, 3, 3);
        const posStartNum4 = new PositionTracker(24, 3, 5);
        const posStartNewline3 = new PositionTracker(25, 3, 6);
        const posStartElif = new PositionTracker(26, 4, 1);
        const posStartNum5 = new PositionTracker(31, 4, 6);
        const posStartLThan2 = new PositionTracker(33, 4, 8);
        const posStartNum6 = new PositionTracker(35, 4, 10);
        const posStartThen2 = new PositionTracker(37, 4, 12);
        const posStartNewline4 = new PositionTracker(41, 4, 16);
        const posStartNum7 = new PositionTracker(42, 5, 1);
        const posStartNewline5 = new PositionTracker(43, 5, 2);
        const posStartElse = new PositionTracker(44, 6, 1);
        const posStartNewline6 = new PositionTracker(48, 6, 5);
        const posStartVarX2 = new PositionTracker(49, 7, 1);
        const posStartEquals3 = new PositionTracker(51, 7, 3);
        const posStartNum8 = new PositionTracker(53, 7, 5);
        const posStartNewline7 = new PositionTracker(56, 7, 8);
        const posStartEnd = new PositionTracker(57, 8, 1);
        const posStartEof = new PositionTracker(60, 8, 4);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.L_THAN, posStartLThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 0),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum3, 0),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline3),
          createToken(TokenTypes.KEYWORD, posStartElif, 'elif'),
          createToken(TokenTypes.NUMBER, posStartNum5, 2),
          createToken(TokenTypes.L_THAN, posStartLThan2),
          createToken(TokenTypes.NUMBER, posStartNum6, 3),
          createToken(TokenTypes.KEYWORD, posStartThen2, 'then'),
          createToken(TokenTypes.NEWLINE, posStartNewline4),
          createToken(TokenTypes.NUMBER, posStartNum7, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline5),
          createToken(TokenTypes.KEYWORD, posStartElse, 'else'),
          createToken(TokenTypes.NEWLINE, posStartNewline6),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals3),
          createToken(TokenTypes.NUMBER, posStartNum8, 100),
          createToken(TokenTypes.NEWLINE, posStartNewline7),
          createToken(TokenTypes.KEYWORD, posStartEnd, 'end'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode5: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum5, 2)
        }
        const numberNode6: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum6, 3)
        }
        const elifCompareNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN, posStartLThan2),
          leftChild: numberNode5,
          rightChild: numberNode6,
        };

        const numberNode7: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum7, 1)
        };
        const elifListNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.NUMBER, posStartNum7, 1),
          elementNodes: [numberNode7]
        };

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        }
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 0)
        }
        const ifCompareNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN, posStartLThan),
          leftChild: numberNode1,
          rightChild: numberNode2,
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 0)
        };
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          node: numberNode3
        };
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 1)
        };
        const varYAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          node: numberNode4
        };
        const ifListNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          elementNodes: [varXAssignNode, varYAssignNode]
        };

        const numberNode8: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum8, 100)
        };
        const varX2AssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          node: numberNode8
        };
        const elseListNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          elementNodes: [varX2AssignNode]
        };
        const ifNode: ASTNode = {
          nodeType: NodeTypes.IFSTATEMENT,
          token: createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          cases: [[ifCompareNode, ifListNode], [elifCompareNode, elifListNode]],
          elseCase: elseListNode
        };

        let expected = new ParseResult();
        expected.success(ifNode);

        for (let i = 0; i < 29; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it(`should produce error for if and else statements with block code and no 'end' keyword`, () => {
        // code: if 1 < 0 then\nx = 0\ny = 1\nelse\n100\n
        const posStartIf = new PositionTracker(0, 1, 1);
        const posStartNum1 = new PositionTracker(3, 1, 4);
        const posStartLThan = new PositionTracker(5, 1, 6);
        const posStartNum2 = new PositionTracker(7, 1, 8);
        const posStartThen = new PositionTracker(9, 1, 10);
        const posStartNewline1 = new PositionTracker(13, 1, 14);
        const posStartVarX = new PositionTracker(14, 2, 1);
        const posStartEquals1 = new PositionTracker(16, 2, 3);
        const posStartNum3 = new PositionTracker(18, 2, 5);
        const posStartNewline2 = new PositionTracker(19, 2, 6);
        const posStartVarY = new PositionTracker(20, 3, 1);
        const posStartEquals2 = new PositionTracker(22, 3, 3);
        const posStartNum4 = new PositionTracker(24, 3, 5);
        const posStartNewline3 = new PositionTracker(25, 3, 6);
        const posStartElse = new PositionTracker(26, 4, 1);
        const posStartNewline4 = new PositionTracker(30, 4, 5);
        const posStartNum5 = new PositionTracker(35, 5, 5);
        const posStartNewline5 = new PositionTracker(38, 5, 8);
        const posStartEof = new PositionTracker(39, 6, 1);
        const posEndEof = new PositionTracker(40, 6, 2);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartIf, 'if'),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.L_THAN, posStartLThan),
          createToken(TokenTypes.NUMBER, posStartNum2, 0),
          createToken(TokenTypes.KEYWORD, posStartThen, 'then'),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum3, 0),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.IDENTIFIER, posStartVarY, 'y'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.NUMBER, posStartNum4, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline3),
          createToken(TokenTypes.KEYWORD, posStartElse, 'else'),
          createToken(TokenTypes.NEWLINE, posStartNewline4),
          createToken(TokenTypes.NUMBER, posStartNum5, 100),
          createToken(TokenTypes.NEWLINE, posStartNewline5),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const error = new InvalidSyntaxError(`Expected 'end' keyword`, posStartEof, posEndEof);

        let expected = new ParseResult();
        expected.failure(error);

        for (let i = 0; i < 18; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for block statements inside a for loop', () => {
        // code: for i = 1 to 5 loop\nx = i\nend
        const posStartFor = new PositionTracker(0, 1, 1);
        const posStartI = new PositionTracker(4, 1, 5);
        const posStartEquals1 = new PositionTracker(6, 1, 7);
        const posStartNum1 = new PositionTracker(8, 1, 9);
        const posStartTo = new PositionTracker(10, 1, 11);
        const posStartNum2 = new PositionTracker(13, 1, 14);
        const posStartLoop = new PositionTracker(15, 1, 16);
        const posStartNewline1 = new PositionTracker(19, 1, 20);
        const posStartVarX = new PositionTracker(20, 2, 1);
        const posStartEquals2 = new PositionTracker(22, 2, 3);
        const posStartVarI = new PositionTracker(24, 2, 5);
        const posStartNewline2 = new PositionTracker(25, 2, 6);
        const posStartEnd = new PositionTracker(26, 3, 1);
        const posStartEof = new PositionTracker(29, 3, 4);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          createToken(TokenTypes.IDENTIFIER, posStartI, 'i'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum1, 1),
          createToken(TokenTypes.KEYWORD, posStartTo, 'to'),
          createToken(TokenTypes.NUMBER, posStartNum2, 5),
          createToken(TokenTypes.KEYWORD, posStartLoop, 'loop'),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.IDENTIFIER, posStartVarI, 'i'),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.KEYWORD, posStartEnd, 'end'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const varIAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarI, 'i'),
        }
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          node: varIAccessNode
        };

        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX, 'x'),
          elementNodes: [varXAssignNode]
        };

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 1)
        };
        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 5)
        };
        const forNode: ASTNode = {
          nodeType: NodeTypes.FORLOOP,
          token: createToken(TokenTypes.KEYWORD, posStartFor, 'for'),
          varNameToken: createToken(TokenTypes.IDENTIFIER, posStartI, 'i'),
          startValueNode: numberNode1,
          endValueNode: numberNode2,
          stepValueNode: null,
          bodyNode: listNode
        };

        let expected = new ParseResult();
        expected.success(forNode);

        for (let i = 0; i < 13; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should return correct AST for block statements inside a while loop', () => {
        // code: x = 0\nfinal = 2\nwhile x < final loop\nx = x + 1\nend
        const posStartVarX1 = new PositionTracker(0, 1, 1);
        const posStartEquals1 = new PositionTracker(2, 1, 3);
        const posStartNum1 = new PositionTracker(4, 1, 5);
        const posStartNewline1 = new PositionTracker(5, 1, 6);
        const posStartVarFinal1 = new PositionTracker(6, 2, 1);
        const posStartEquals2 = new PositionTracker(12, 2, 7);
        const posStartNum2 = new PositionTracker(14, 2, 9);
        const posStartNewline2 = new PositionTracker(15, 2, 16);
        const posStartWhile = new PositionTracker(16, 3, 1);
        const posStartVarX2 = new PositionTracker(22, 3, 7);
        const posStartLThan = new PositionTracker(24, 3, 9);
        const posStartVarFinal2 = new PositionTracker(26, 3, 11);
        const posStartLoop = new PositionTracker(32, 3, 17);
        const posStartNewline3 = new PositionTracker(36, 3, 21);
        const posStartVarX3 = new PositionTracker(37, 4, 1);
        const posStartEquals3 = new PositionTracker(39, 4, 3);
        const posStartVarX4 = new PositionTracker(41, 4, 5);
        const posStartPlus = new PositionTracker(43, 4, 7);
        const posStartNum3 = new PositionTracker(45, 4, 9);
        const posStartNewline4 = new PositionTracker(46, 4, 10);
        const posStartEnd = new PositionTracker(47, 5, 1);
        const posStartEof = new PositionTracker(50, 5, 4);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.IDENTIFIER, posStartVarX1, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.NUMBER, posStartNum1, 0),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarFinal1, 'final'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.NUMBER, posStartNum2, 2),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.KEYWORD, posStartWhile, 'while'),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.L_THAN, posStartLThan),
          createToken(TokenTypes.IDENTIFIER, posStartVarFinal2, 'final'),
          createToken(TokenTypes.KEYWORD, posStartLoop, 'loop'),
          createToken(TokenTypes.NEWLINE, posStartNewline3),
          createToken(TokenTypes.IDENTIFIER, posStartVarX3, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals3),
          createToken(TokenTypes.IDENTIFIER, posStartVarX4, 'x'),
          createToken(TokenTypes.PLUS, posStartPlus),
          createToken(TokenTypes.NUMBER, posStartNum3, 1),
          createToken(TokenTypes.NEWLINE, posStartNewline4),
          createToken(TokenTypes.KEYWORD, posStartEnd, 'end'),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 0)
        };
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX1, 'x'),
          node: numberNode1
        };

        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 2)
        };
        const varFinalAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarFinal1, 'final'),
          node: numberNode2
        };

        const varXAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x')
        };
        const varFinalAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarFinal2, 'final')
        };
        const compareNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.L_THAN, posStartLThan),
          leftChild: varXAccessNode,
          rightChild: varFinalAccessNode
        };

        const varXAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX4, 'x')
        };
        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 1)
        };
        const addNode: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.PLUS, posStartPlus),
          leftChild: varXAccessNode2,
          rightChild: numberNode3
        };
        const varXAssignNode2: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX3, 'x'),
          node: addNode
        };
        const bodyNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX3, 'x'),
          elementNodes: [varXAssignNode2]
        };
        const whileNode: ASTNode = {
          nodeType: NodeTypes.WHILELOOP,
          token: createToken(TokenTypes.KEYWORD, posStartWhile, 'while'),
          conditionNode: compareNode,
          bodyNode: bodyNode
        };

        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX1, 'x'),
          elementNodes: [varXAssignNode, varFinalAssignNode, whileNode]
        };

        let expected = new ParseResult();
        expected.success(listNode);

        for (let i = 0; i < 21; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });

      it('should produce correct AST for functions with block code', () => {
        // Note: The tested source used would give a runtime error if executed by the interpreter
        // since the output functions are not given string arguments.

        // code: function doubleXTripleY(x, y)\nx = x * 2\ny = y * 3\noutput(x)\noutput(y)\nend\ndoubleXTripleY(10, 20)
        const posStartFunction = new PositionTracker(0, 1, 1);
        const posStartFuncName = new PositionTracker(9, 1, 10);
        const posStartLeftBrack1 = new PositionTracker(23, 1, 24);
        const posStartVarX1 = new PositionTracker(24, 1, 25);
        const posStartComma1 = new PositionTracker(25, 1, 26);
        const posStartVarY1 = new PositionTracker(27, 1, 28);
        const posStartRightBrack1 = new PositionTracker(28, 1, 29);
        const posStartNewline1 = new PositionTracker(29, 1, 30);
        const posStartVarX2 = new PositionTracker(30, 2, 1);
        const posStartEquals1 = new PositionTracker(32, 2, 3);
        const posStartVarX3 = new PositionTracker(34, 2, 5);
        const posStartMultiply1 = new PositionTracker(36, 2, 7);
        const posStartNum1 = new PositionTracker(38, 2, 9);
        const posStartNewline2 = new PositionTracker(39, 2, 10);
        const posStartVarY2 = new PositionTracker(40, 3, 1);
        const posStartEquals2 = new PositionTracker(42, 3, 3);
        const posStartVarY3 = new PositionTracker(44, 3, 5);
        const posStartMultiply2 = new PositionTracker(46, 3, 7);
        const posStartNum2 = new PositionTracker(48, 3, 9);
        const posStartNewline3 = new PositionTracker(49, 3, 10);
        const posStartFuncCall1 = new PositionTracker(50, 4, 1);
        const posStartLeftBrack2 = new PositionTracker(56, 4, 7);
        const posStartVarX4 = new PositionTracker(57, 4, 8);
        const posStartRightBrack2 = new PositionTracker(58, 4, 9);
        const posStartNewline4 = new PositionTracker(59, 4, 10);
        const posStartFuncCall2 = new PositionTracker(60, 5, 1);
        const posStartLeftBrack3 = new PositionTracker(66, 5, 7);
        const posStartVarY4 = new PositionTracker(67, 5, 8);
        const posStartRightBrack3 = new PositionTracker(68, 5, 9);
        const posStartNewline5 = new PositionTracker(69, 5, 10);
        const posStartEnd = new PositionTracker(70, 6, 1);
        const posStartNewline6 = new PositionTracker(73, 6, 4);
        const posStartFuncCall3 = new PositionTracker(74, 7, 1);
        const posStartLeftBrack4 = new PositionTracker(88, 7, 15);
        const posStartNum3 = new PositionTracker(89, 7, 16);
        const posStartComma2 = new PositionTracker(91, 7, 18);
        const posStartNum4 = new PositionTracker(93, 7, 20);
        const posStartRightBrack4 = new PositionTracker(95, 7, 22);
        const posStartEof = new PositionTracker(96, 7, 23);

        const tokenList: Array<Token> = [
          createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'doubleXTripleY'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX1, 'x'),
          createToken(TokenTypes.COMMA, posStartComma1),
          createToken(TokenTypes.IDENTIFIER, posStartVarY1, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack1),
          createToken(TokenTypes.NEWLINE, posStartNewline1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          createToken(TokenTypes.EQUALS, posStartEquals1),
          createToken(TokenTypes.IDENTIFIER, posStartVarX3, 'x'),
          createToken(TokenTypes.MULTIPLY, posStartMultiply1),
          createToken(TokenTypes.NUMBER, posStartNum1, 2),
          createToken(TokenTypes.NEWLINE, posStartNewline2),
          createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          createToken(TokenTypes.EQUALS, posStartEquals2),
          createToken(TokenTypes.IDENTIFIER, posStartVarY3, 'y'),
          createToken(TokenTypes.MULTIPLY, posStartMultiply2),
          createToken(TokenTypes.NUMBER, posStartNum2, 3),
          createToken(TokenTypes.NEWLINE, posStartNewline3),
          createToken(TokenTypes.IDENTIFIER, posStartFuncCall1, 'output'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack2),
          createToken(TokenTypes.IDENTIFIER, posStartVarX4, 'x'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack2),
          createToken(TokenTypes.NEWLINE, posStartNewline4),
          createToken(TokenTypes.IDENTIFIER, posStartFuncCall2, 'output'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack3),
          createToken(TokenTypes.IDENTIFIER, posStartVarY4, 'y'),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack3),
          createToken(TokenTypes.NEWLINE, posStartNewline5),
          createToken(TokenTypes.KEYWORD, posStartEnd, 'end'),
          createToken(TokenTypes.NEWLINE, posStartNewline6),
          createToken(TokenTypes.IDENTIFIER, posStartFuncCall3, 'doubleXTripleY'),
          createToken(TokenTypes.L_BRACKET, posStartLeftBrack4),
          createToken(TokenTypes.NUMBER, posStartNum3, 10),
          createToken(TokenTypes.COMMA, posStartComma2),
          createToken(TokenTypes.NUMBER, posStartNum4, 20),
          createToken(TokenTypes.R_BRACKET, posStartRightBrack4),
          createToken(TokenTypes.EOF, posStartEof)
        ];

        const parser = new Parser(tokenList);
        const parseResult: ParseResult = parser.parse();

        const numberNode1: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum1, 2)
        };
        const varXAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX3, 'x')
        };
        const multiplyNode1: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply1),
          leftChild: varXAccessNode,
          rightChild: numberNode1
        };
        const varXAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          node: multiplyNode1
        };

        const numberNode2: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum2, 3)
        };
        const varYAccessNode: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY3, 'y')
        };
        const multiplyNode2: ASTNode = {
          nodeType: NodeTypes.BINARYOP,
          token: createToken(TokenTypes.MULTIPLY, posStartMultiply2),
          leftChild: varYAccessNode,
          rightChild: numberNode2
        };
        const varYAssignNode: ASTNode = {
          nodeType: NodeTypes.VARASSIGN,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY2, 'y'),
          node: multiplyNode2
        };

        const varXAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX4, 'x')
        };
        const funcNameNode1: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall1, 'output')
        };
        const funcCallNode1: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall1, 'output'),
          nodeToCall: funcNameNode1,
          argNodes: [varXAccessNode2]
        };

        const varYAccessNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarY4, 'y')
        };
        const funcNameNode2: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall2, 'output')
        };
        const funcCallNode2: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall2, 'output'),
          nodeToCall: funcNameNode2,
          argNodes: [varYAccessNode2]
        };

        const bodyNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.IDENTIFIER, posStartVarX2, 'x'),
          elementNodes: [varXAssignNode, varYAssignNode, funcCallNode1, funcCallNode2]
        };
        const functionDefNode: ASTNode = {
          nodeType: NodeTypes.FUNCTIONDEF,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          varNameToken: createToken(TokenTypes.IDENTIFIER, posStartFuncName, 'doubleXTripleY'),
          argNameTokens: [
            createToken(TokenTypes.IDENTIFIER, posStartVarX1, 'x'),
            createToken(TokenTypes.IDENTIFIER, posStartVarY1, 'y'),
          ],
          bodyNode: bodyNode
        };

        const numberNode3: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum3, 10)
        }
        const numberNode4: ASTNode = {
          nodeType: NodeTypes.NUMBER,
          token: createToken(TokenTypes.NUMBER, posStartNum4, 20)
        }
        const funcNameNode3: ASTNode = {
          nodeType: NodeTypes.VARACCESS,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall3, 'doubleXTripleY')
        };
        const funcCallNode3: ASTNode = {
          nodeType: NodeTypes.FUNCTIONCALL,
          token: createToken(TokenTypes.IDENTIFIER, posStartFuncCall3, 'doubleXTripleY'),
          nodeToCall: funcNameNode3,
          argNodes: [numberNode3, numberNode4]
        }
        const listNode: ASTNode = {
          nodeType: NodeTypes.LIST,
          token: createToken(TokenTypes.KEYWORD, posStartFunction, 'function'),
          elementNodes: [functionDefNode, funcCallNode3]
        };

        let expected = new ParseResult();
        expected.success(listNode);

        for (let i = 0; i < 38; i++) { expected.registerAdvancement(); }

        expect(parseResult.getNode()).toEqual(expected.getNode());
        expect(parseResult.getError()).toEqual(expected.getError());
        expect(parseResult.getAdvanceCount()).toEqual(expected.getAdvanceCount());
      });
    });
  });
});
