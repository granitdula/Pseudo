import { PositionTracker } from './position-tracker';
import { ASTNode } from './../models/ast-node';
import { ParseResult } from './parse-result';
import { InvalidSyntaxError } from './invalid-syntax-error';
import { Token } from '../models/token';
import { EQUALS } from './token-type.constants';

describe('ParseResult tests', () => {
  it('should initialise node and error attributes as null and advanceCount to 0', () => {
    const parseResult = new ParseResult();

    expect(parseResult.getError()).toEqual(null);
    expect(parseResult.getNode()).toEqual(null);
    expect(parseResult.getAdvanceCount()).toEqual(0);
  });

  describe('success tests', () => {
    it('should return a node instance and null error when using getter, after calling success', () => {
      const astNode: ASTNode = createASTNode(EQUALS);
      const parseResult = new ParseResult();

      parseResult.success(astNode);

      expect(parseResult.getNode()).toEqual(astNode);
      expect(parseResult.getError()).toEqual(null);
      expect(parseResult.getAdvanceCount()).toEqual(0);
    });
  });

  describe('failure tests', () => {
    it('should return an error instance and null node when using getter, after calling failure', () => {
      const posStart = new PositionTracker(4, 1, 5);
      const posEnd = new PositionTracker(5, 1, 6);
      const syntaxError = new InvalidSyntaxError(`missing ')'`, posStart, posEnd);
      const parseResult = new ParseResult();

      parseResult.failure(syntaxError);

      expect(parseResult.getError()).toEqual(syntaxError);
      expect(parseResult.getNode()).toEqual(null);
      expect(parseResult.getAdvanceCount()).toEqual(0);
    });
  });

  describe('register tests', () => {
    it('should return node in passed in parse result and assign error if error exists in passed parse result', () => {
      const posStart = new PositionTracker(4, 1, 5);
      const posEnd = new PositionTracker(5, 1, 6);
      const syntaxError = new InvalidSyntaxError(`missing ')'`, posStart, posEnd);
      const errorParseResult = new ParseResult();
      errorParseResult.failure(syntaxError);

      const parseResult = new ParseResult();
      const returnedNode: ASTNode = parseResult.register(errorParseResult);

      expect(returnedNode).toEqual(errorParseResult.getNode());
      expect(parseResult.getNode()).toEqual(null);
      expect(parseResult.getError()).toEqual(syntaxError);
      expect(parseResult.getAdvanceCount()).toEqual(0);
    });

    it('should return node in passed in parse result and assign node if node exists in passed parse result', () => {
      const astNode: ASTNode = createASTNode(EQUALS);
      const nodeParseResult = new ParseResult();
      nodeParseResult.success(astNode);

      const parseResult = new ParseResult();
      const returnedNode: ASTNode = parseResult.register(nodeParseResult);

      expect(returnedNode).toEqual(astNode);
      expect(parseResult.getNode()).toEqual(null);
      expect(parseResult.getError()).toEqual(null);
      expect(parseResult.getAdvanceCount()).toEqual(0);
    });
  });

  describe('registerAdvancement tests', () => {
    it('should increment advanceCount of parse result when registerAdvancement is called', () => {
      const parseResult = new ParseResult();

      parseResult.registerAdvancement();
      expect(parseResult.getAdvanceCount()).toEqual(1);

      parseResult.registerAdvancement();
      expect(parseResult.getAdvanceCount()).toEqual(2);
    });

    it('should add advanceCounts of one parse result to another when registering a parse result', () => {
      const parseResult1 = new ParseResult();
      const parseResult2 = new ParseResult();

      for (let i = 0; i < 3; i++) { parseResult1.registerAdvancement(); }

      parseResult2.register(parseResult1);

      expect(parseResult1.getAdvanceCount()).toEqual(3);
      expect(parseResult2.getAdvanceCount()).toEqual(3);
    });
  });
});

function createASTNode(tokenType: string): ASTNode {
  const startPos = new PositionTracker(0, 1, 1);
  const endPos = startPos.copy();
  endPos.advance();

  const equalsToken: Token = {
    type: tokenType,
    positionStart: startPos,
    positionEnd: endPos
  };

  const astNode: ASTNode = { token: equalsToken };

  return astNode;
}
