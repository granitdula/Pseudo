import { Lexer } from './lexer';
import { Error } from './error';
import { Token } from '../models/token';
import * as TokenTypes from './token-type.constants';

describe('Lexer tests', () => {
  describe('lex tests', () => {
    describe('Single character source code token tests', () => {
      it('should return empty list if character is a whitespace', () => {

        const sourceCode: string = ' ';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);
        const expected: Array<Token> = [];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a newline', () => {

        const sourceCode: string = '\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.NEWLINE);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return error class with correct message if character is a tab', () => {

        const sourceCode: string = '\t';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = 'contains tabs.';
        const expected: Error = new Error(expectErrorType, expectErrorDetails);

        if (error instanceof Error) {
          expect(error.getErrorMessage()).toEqual(expected.getErrorMessage());
        }
        else{
          fail('Token array created instead of an Error object.');
        }
      });

      it('should return list with correct token if character is a +', () => {

        const sourceCode: string = '+';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.PLUS);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a -', () => {

        const sourceCode: string = '-';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.MINUS);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a *', () => {

        const sourceCode: string = '*';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.MULTIPLY);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a /', () => {

        const sourceCode: string = '/';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.DIVIDE);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a ^', () => {

        const sourceCode: string = '^';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.POWER);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a (', () => {

        const sourceCode: string = '(';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.L_BRACKET);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a )', () => {

        const sourceCode: string = ')';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.R_BRACKET);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a ,', () => {

        const sourceCode: string = ',';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.COMMA);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is the number 5', () => {

        const sourceCode: string = '5';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.NUMBER, 5);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is the letter g', () => {

        const sourceCode: string = 'g';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.IDENTIFIER, 'g');
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });
    });

    describe('Comparator and equal symbol tokens tests', () => {
      it(`should return a list of correct tokens for the string '=\n'`, () => {

        const sourceCode: string = '=\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken1: Token = createToken(TokenTypes.EQUALS);
        const expectedToken2: Token = createToken(TokenTypes.NEWLINE);
        const expected: Array<Token> = [expectedToken1, expectedToken2];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list with correct token for the string '=='`, () => {

        const sourceCode: string = '==';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.EQUALITY);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list of correct tokens for the string '>\n'`, () => {

        const sourceCode: string = '>\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken1: Token = createToken(TokenTypes.G_THAN);
        const expectedToken2: Token = createToken(TokenTypes.NEWLINE);
        const expected: Array<Token> = [expectedToken1, expectedToken2];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list with correct token for the string '>='`, () => {

        const sourceCode: string = '>=';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.G_THAN_EQ);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list of correct tokens for the string '<\n'`, () => {

        const sourceCode: string = '<\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken1: Token = createToken(TokenTypes.L_THAN);
        const expectedToken2: Token = createToken(TokenTypes.NEWLINE);
        const expected: Array<Token> = [expectedToken1, expectedToken2];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list with correct token for the string '<='`, () => {

        const sourceCode: string = '<=';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const expectedToken: Token = createToken(TokenTypes.L_THAN_EQ);
        const expected: Array<Token> = [expectedToken];

        expect(tokens).toEqual(expected);
      });
    });

    describe('Multi-character syntactically valid source code token tests', () => {
      describe('Variable assignment tokens tests', () => {
        it('should return a list of correct tokens for single line variable assignment', () => {

          const sourceCode: string = 'x = 2 ^ 1\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const expectedToken1: Token = createToken(TokenTypes.IDENTIFIER, 'x');
          const expectedToken2: Token = createToken(TokenTypes.EQUALS);
          const expectedToken3: Token = createToken(TokenTypes.NUMBER, 2);
          const expectedToken4: Token = createToken(TokenTypes.POWER);
          const expectedToken5: Token = createToken(TokenTypes.NUMBER, 1);
          const expectedToken6: Token = createToken(TokenTypes.NEWLINE);

          const expected: Array<Token> = [expectedToken1, expectedToken2,
                                          expectedToken3, expectedToken4,
                                          expectedToken5, expectedToken6];

          expect(tokens).toEqual(expected);
        });

        it('should return a list of correct tokens for a decimal number variable assignment', () => {

          const sourceCode: string = 'x = 3.1415\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const expectedToken1: Token = createToken(TokenTypes.IDENTIFIER, 'x');
          const expectedToken2: Token = createToken(TokenTypes.EQUALS);
          const expectedToken3: Token = createToken(TokenTypes.NUMBER, 3.1415);
          const expectedToken4: Token = createToken(TokenTypes.NEWLINE);

          const expected: Array<Token> = [expectedToken1, expectedToken2,
                                          expectedToken3, expectedToken4];

          expect(tokens).toEqual(expected);
        });

        it('should return a list of correct tokens for complex single line variable assignment', () => {

          const sourceCode: string = 'variable = NOT ((1 >= 2) AND (23 < 11 OR 0 == 1))\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const tokenData: Array<Array<string | any>> = [
            [TokenTypes.IDENTIFIER, 'variable'], [TokenTypes.EQUALS],
            [TokenTypes.IDENTIFIER, 'NOT'], [TokenTypes.L_BRACKET],
            [TokenTypes.L_BRACKET], [TokenTypes.NUMBER, 1], [TokenTypes.G_THAN_EQ],
            [TokenTypes.NUMBER, 2], [TokenTypes.R_BRACKET],
            [TokenTypes.IDENTIFIER, 'AND'], [TokenTypes.L_BRACKET],
            [TokenTypes.NUMBER, 23], [TokenTypes.L_THAN], [TokenTypes.NUMBER, 11],
            [TokenTypes.IDENTIFIER, 'OR'], [TokenTypes.NUMBER, 0],
            [TokenTypes.EQUALITY], [TokenTypes.NUMBER, 1], [TokenTypes.R_BRACKET],
            [TokenTypes.R_BRACKET], [TokenTypes.NEWLINE]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);

          expect(tokens).toEqual(expected);
        });
      });

      describe('If/else statement tokens tests', () => {
        it('should return list of correct tokens for source code with if/else statement', () => {

          const sourceCode: string = 'if (10 > 1 AND TRUE) then\n  x = 1\nelse\n  x = 2\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const tokenData: Array<Array<string | any>> = [
            [TokenTypes.IDENTIFIER, 'if'], [TokenTypes.L_BRACKET],
            [TokenTypes.NUMBER, 10], [TokenTypes.G_THAN], [TokenTypes.NUMBER, 1],
            [TokenTypes.IDENTIFIER, 'AND'], [TokenTypes.IDENTIFIER, 'TRUE'],
            [TokenTypes.R_BRACKET], [TokenTypes.IDENTIFIER, 'then'],
            [TokenTypes.NEWLINE], [TokenTypes.IDENTIFIER, 'x'], [TokenTypes.EQUALS],
            [TokenTypes.NUMBER, 1], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'else'], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'x'], [TokenTypes.EQUALS], [TokenTypes.NUMBER, 2],
            [TokenTypes.NEWLINE], [TokenTypes.IDENTIFIER, 'end'], [TokenTypes.NEWLINE]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);

          expect(tokens).toEqual(expected);
        });
      });

      describe('For/while loop tokens test', () => {
        it('should return list of correct tokens for source code with for loop', () => {

          const sourceCode: string = 'x = 1\nfor (i = 1 to 10) loop\n  x = x * i\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const tokenData: Array<Array<string | any>> = [
            [TokenTypes.IDENTIFIER, 'x'], [TokenTypes.EQUALS], [TokenTypes.NUMBER, 1],
            [TokenTypes.NEWLINE], [TokenTypes.IDENTIFIER, 'for'],
            [TokenTypes.L_BRACKET], [TokenTypes.IDENTIFIER, 'i'], [TokenTypes.EQUALS],
            [TokenTypes.NUMBER, 1], [TokenTypes.IDENTIFIER, 'to'],
            [TokenTypes.NUMBER, 10], [TokenTypes.R_BRACKET],
            [TokenTypes.IDENTIFIER, 'loop'], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'x'], [TokenTypes.EQUALS],
            [TokenTypes.IDENTIFIER, 'x'], [TokenTypes.MULTIPLY],
            [TokenTypes.IDENTIFIER, 'i'], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'end'], [TokenTypes.NEWLINE]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);

          expect(tokens).toEqual(expected);
        });

        it('should return list of correct tokens for source code with while loop', () => {

          const sourceCode: string = 'x = 10\ni = 1\nwhile (i < x) loop\n  i = i + 1\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const tokenData: Array<Array<string | any>> = [
            [TokenTypes.IDENTIFIER, 'x'], [TokenTypes.EQUALS], [TokenTypes.NUMBER, 10],
            [TokenTypes.NEWLINE], [TokenTypes.IDENTIFIER, 'i'],
            [TokenTypes.EQUALS], [TokenTypes.NUMBER, 1], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'while'], [TokenTypes.L_BRACKET],
            [TokenTypes.IDENTIFIER, 'i'], [TokenTypes.L_THAN],
            [TokenTypes.IDENTIFIER, 'x'], [TokenTypes.R_BRACKET],
            [TokenTypes.IDENTIFIER, 'loop'], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'i'], [TokenTypes.EQUALS],
            [TokenTypes.IDENTIFIER, 'i'], [TokenTypes.PLUS], [TokenTypes.NUMBER, 1],
            [TokenTypes.NEWLINE], [TokenTypes.IDENTIFIER, 'end'], [TokenTypes.NEWLINE]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);

          expect(tokens).toEqual(expected);
        });
      });

      describe('Function calls/definitions token tests', () => {
        it('should return list of correct tokens for source code with function definition', () => {

          const sourceCode: string = 'function add(x, y) begin\n  return x + y\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const tokenData: Array<Array<string | any>> = [
            [TokenTypes.IDENTIFIER, 'function'], [TokenTypes.IDENTIFIER, 'add'],
            [TokenTypes.L_BRACKET], [TokenTypes.IDENTIFIER, 'x'],
            [TokenTypes.COMMA], [TokenTypes.IDENTIFIER, 'y'], [TokenTypes.R_BRACKET],
            [TokenTypes.IDENTIFIER, 'begin'], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'return'], [TokenTypes.IDENTIFIER, 'x'],
            [TokenTypes.PLUS], [TokenTypes.IDENTIFIER, 'y'], [TokenTypes.NEWLINE],
            [TokenTypes.IDENTIFIER, 'end'], [TokenTypes.NEWLINE]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);
          console.log(tokens);
          console.log(expected);
          expect(tokens).toEqual(expected);
        });

        it('should return list of correct tokens for source code with function call', () => {

          const sourceCode: string = 'output(10)\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const expectedToken1: Token = createToken(TokenTypes.IDENTIFIER, 'output');
          const expectedToken2: Token = createToken(TokenTypes.L_BRACKET);
          const expectedToken3: Token = createToken(TokenTypes.NUMBER, 10);
          const expectedToken4: Token = createToken(TokenTypes.R_BRACKET);
          const expectedToken5: Token = createToken(TokenTypes.NEWLINE);

          const expected: Array<Token> = [expectedToken1, expectedToken2,
                                          expectedToken3, expectedToken4,
                                          expectedToken5];

          expect(tokens).toEqual(expected);
        });
      });
    });

    describe('Error case tests', () => {
      it('should return appropriate error for assigning number with more than one decimal point', () => {

        const sourceCode: string = 'x = 1.2.1\n';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = 'number has more than one decimal point.';
        const expected: Error = new Error(expectErrorType, expectErrorDetails);

        if (error instanceof Error) {
          expect(error.getErrorMessage()).toEqual(expected.getErrorMessage());
        }
        else{
          fail('Token array created instead of an Error object.');
        }
      });

      it(`should return appropriate error for statement ending in '='`, () => {

        const sourceCode: string = 'x =';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `can not end line statement with '='.`;
        const expected: Error = new Error(expectErrorType, expectErrorDetails);

        if (error instanceof Error) {
          expect(error.getErrorMessage()).toEqual(expected.getErrorMessage());
        }
        else{
          fail('Token array created instead of an Error object.');
        }
      });

      it(`should return appropriate error for statement ending in '>'`, () => {

        const sourceCode: string = 'x >';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `can not end line statement with '>'.`;
        const expected: Error = new Error(expectErrorType, expectErrorDetails);

        if (error instanceof Error) {
          expect(error.getErrorMessage()).toEqual(expected.getErrorMessage());
        }
        else{
          fail('Token array created instead of an Error object.');
        }
      });

      it(`should return appropriate error for statement ending in '<'`, () => {

        const sourceCode: string = 'x <';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `can not end line statement with '<'.`;
        const expected: Error = new Error(expectErrorType, expectErrorDetails);

        if (error instanceof Error) {
          expect(error.getErrorMessage()).toEqual(expected.getErrorMessage());
        }
        else{
          fail('Token array created instead of an Error object.');
        }
      });

      it('should return appropriate error for variable with invalid character in assignment', () => {

        const sourceCode: string = 'v@riable = 1';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `the character '@' is not valid.`;
        const expected: Error = new Error(expectErrorType, expectErrorDetails);

        if (error instanceof Error) {
          expect(error.getErrorMessage()).toEqual(expected.getErrorMessage());
        }
        else{
          fail('Token array created instead of an Error object.');
        }
      });
    });
  });
});

// Utility functions.
function createToken(type: string, value?: any): Token {

  let token: Token;

  if (value === undefined) {
    token = {
      type: type
    };
  }
  else {
    token = {
      type: type,
      value: value
    };
  }

  return token;
}

function createTokenArray(tokenData: Array<Array<string | any>>): Array<Token> {

  let tokens: Array<Token> = [];

  for (let data of tokenData) {
    let token: Token;

    if (data.length === 1) {
      token = createToken(data[0]);
    }
    else {
      token = createToken(data[0], data[1]);
    }

    tokens.push(token);
  }

  return tokens;
}
