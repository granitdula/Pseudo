import { PositionTracker } from './position-tracker';
import { ASTNode } from './../models/ast-node';
import { ParseResult } from './parse-result';
import { InvalidSyntaxError } from './invalid-syntax-error';
import { Token } from '../models/token';
import { EQUALS } from './token-type.constants';

describe('ParseResult tests', () => {
  it('should initialise node and error attributes as null', () => {
    const parseResult = new ParseResult();

    expect(parseResult.getError()).toEqual(null);
    expect(parseResult.getNode()).toEqual(null);
  });

  describe('success tests', () => {
    it('should return a node instance and null error when using getter, after calling success', () => {
      const astNode: ASTNode = createASTNode(EQUALS);
      const parseResult = new ParseResult();

      parseResult.success(astNode);

      expect(parseResult.getNode()).toEqual(astNode);
      expect(parseResult.getError()).toEqual(null);
    });
  });

  describe('failure tests', () => {
    it('should return an error instance and null node when using getter, after calling failure', () => {
      const syntaxError = new InvalidSyntaxError(`missing ')'`);
      const parseResult = new ParseResult();

      parseResult.failure(syntaxError);

      expect(parseResult.getError()).toEqual(syntaxError);
      expect(parseResult.getNode()).toEqual(null);
    });
  });

  describe('register tests', () => {
    it('should return passed node arg and keep node and error attributes null', () => {
      const astNode: ASTNode = createASTNode(EQUALS);
      const parseResult = new ParseResult();

      const returnedNode: ASTNode = parseResult.register(astNode);

      expect(returnedNode).toEqual(astNode);
      expect(parseResult.getNode()).toEqual(null);
      expect(parseResult.getError()).toEqual(null);
    });

    it('should return node in passed in parse result and assign error if error exists in passed parse result', () => {
      const syntaxError = new InvalidSyntaxError(`missing ')'`);
      const errorParseResult = new ParseResult();
      errorParseResult.failure(syntaxError);

      const parseResult = new ParseResult();
      const returnedNode: ASTNode = parseResult.register(errorParseResult);

      expect(returnedNode).toEqual(errorParseResult.getNode());
      expect(parseResult.getNode()).toEqual(null);
      expect(parseResult.getError()).toEqual(syntaxError);
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
