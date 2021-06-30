import { PositionTracker } from './position-tracker';
import { Lexer } from './lexer';
import { Error } from './error';
import { Token } from '../models/token';
import * as TokenTypes from '../constants/token-type.constants';

describe('Lexer tests', () => {
  describe('lex tests', () => {
    describe('Single character source code token tests', () => {
      it('should return empty list if character is a whitespace', () => {

        const sourceCode: string = ' ';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expected: Array<Token> = [eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a newline', () => {

        const sourceCode: string = '\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 2, 1));
        const expectedToken: Token = createToken(TokenTypes.NEWLINE, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return error class with correct message if character is a tab', () => {

        const sourceCode: string = '\t';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const posStart = new PositionTracker(0, 1, 1);
        const posEnd = new PositionTracker(1, 1, 2);
        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = 'contains tabs.';
        const expected: Error = new Error(expectErrorType, posStart, posEnd, expectErrorDetails);

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

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.PLUS, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a -', () => {

        const sourceCode: string = '-';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.MINUS, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a *', () => {

        const sourceCode: string = '*';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.MULTIPLY, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a /', () => {

        const sourceCode: string = '/';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.DIVIDE, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a ^', () => {

        const sourceCode: string = '^';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.POWER, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a (', () => {

        const sourceCode: string = '(';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.L_BRACKET, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a )', () => {

        const sourceCode: string = ')';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.R_BRACKET, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is a ,', () => {

        const sourceCode: string = ',';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.COMMA, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is the number 5', () => {

        const sourceCode: string = '5';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.NUMBER, posTracker, 5);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if character is the letter g', () => {

        const sourceCode: string = 'g';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(1, 1, 2));
        const expectedToken: Token = createToken(TokenTypes.IDENTIFIER, posTracker, 'g');
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if string is: variable_name', () => {

        const sourceCode: string = 'variable_name';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(13, 1, 14));
        const expectedToken: Token = createToken(TokenTypes.IDENTIFIER, posTracker, 'variable_name');
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if string is: _variable', () => {

        const sourceCode: string = '_variable';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(9, 1, 10));
        const expectedToken: Token = createToken(TokenTypes.IDENTIFIER, posTracker, '_variable');
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if string is: variable1', () => {

        const sourceCode: string = 'variable1';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(9, 1, 10));
        const expectedToken: Token = createToken(TokenTypes.IDENTIFIER, posTracker, 'variable1');
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if string is: variable123', () => {

        const sourceCode: string = 'variable123';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(11, 1, 12));
        const expectedToken: Token = createToken(TokenTypes.IDENTIFIER, posTracker, 'variable123');
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it('should return list with correct token if string is: 1variable', () => {

        const sourceCode: string = '1variable';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTrackerNum = new PositionTracker(0, 1, 1);
        const posTrackerVar = new PositionTracker(1, 1, 2);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(9, 1, 10));
        const expectedNumToken: Token = createToken(TokenTypes.NUMBER, posTrackerNum, 1);
        const expectedVarToken: Token = createToken(TokenTypes.IDENTIFIER, posTrackerVar, 'variable');
        const expected: Array<Token> = [expectedNumToken, expectedVarToken, eofToken];

        expect(tokens).toEqual(expected);
      });
    });

    describe('Comparator and equal symbol tokens tests', () => {
      it(`should return a list of correct tokens for the string '=\n'`, () => {

        const sourceCode: string = '=\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(2, 2, 1));
        const expectedToken1: Token = createToken(TokenTypes.EQUALS, posTracker);
        posTracker.advance();
        const expectedToken2: Token = createToken(TokenTypes.NEWLINE, posTracker);
        const expected: Array<Token> = [expectedToken1, expectedToken2, eofToken];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list with correct token for the string '=='`, () => {

        const sourceCode: string = '==';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(2, 1, 3));
        const expectedToken: Token = createToken(TokenTypes.EQUALITY, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list of correct tokens for the string '>\n'`, () => {

        const sourceCode: string = '>\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(2, 2, 1));
        const expectedToken1: Token = createToken(TokenTypes.G_THAN, posTracker);
        posTracker.advance();
        const expectedToken2: Token = createToken(TokenTypes.NEWLINE, posTracker);
        const expected: Array<Token> = [expectedToken1, expectedToken2, eofToken];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list with correct token for the string '>='`, () => {

        const sourceCode: string = '>=';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(2, 1, 3));
        const expectedToken: Token = createToken(TokenTypes.G_THAN_EQ, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list of correct tokens for the string '<\n'`, () => {

        const sourceCode: string = '<\n';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(2, 2, 1));
        const expectedToken1: Token = createToken(TokenTypes.L_THAN, posTracker);
        posTracker.advance();
        const expectedToken2: Token = createToken(TokenTypes.NEWLINE, posTracker);
        const expected: Array<Token> = [expectedToken1, expectedToken2, eofToken];

        expect(tokens).toEqual(expected);
      });

      it(`should return a list with correct token for the string '<='`, () => {

        const sourceCode: string = '<=';
        const lexer: Lexer = new Lexer();

        const tokens: Array<Token> | Error = lexer.lex(sourceCode);

        const posTracker = new PositionTracker(0, 1, 1);
        const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(2, 1, 3));
        const expectedToken: Token = createToken(TokenTypes.L_THAN_EQ, posTracker);
        const expected: Array<Token> = [expectedToken, eofToken];

        expect(tokens).toEqual(expected);
      });
    });

    describe('Multi-character syntactically valid source code token tests', () => {
      describe('Variable assignment tokens tests', () => {
        it('should return a list of correct tokens for single line variable assignment', () => {

          const sourceCode: string = 'x = 2 ^ 1\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker = new PositionTracker(0, 1, 1);
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(10, 2, 1));
          const expectedToken1: Token = createToken(TokenTypes.IDENTIFIER, posTracker, 'x');
          posTracker.advance();
          posTracker.advance();
          const expectedToken2: Token = createToken(TokenTypes.EQUALS, posTracker);
          posTracker.advance();
          posTracker.advance();
          const expectedToken3: Token = createToken(TokenTypes.NUMBER, posTracker, 2);
          posTracker.advance();
          posTracker.advance();
          const expectedToken4: Token = createToken(TokenTypes.POWER, posTracker);
          posTracker.advance();
          posTracker.advance();
          const expectedToken5: Token = createToken(TokenTypes.NUMBER, posTracker, 1);
          posTracker.advance();
          const expectedToken6: Token = createToken(TokenTypes.NEWLINE, posTracker);

          const expected: Array<Token> = [expectedToken1, expectedToken2, expectedToken3,
                                          expectedToken4, expectedToken5, expectedToken6,
                                          eofToken];

          expect(tokens).toEqual(expected);
        });

        it('should return a list of correct tokens for a decimal number variable assignment', () => {

          const sourceCode: string = 'x = 3.1415\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker = new PositionTracker(0, 1, 1);
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(11, 2, 1));
          const expectedToken1: Token = createToken(TokenTypes.IDENTIFIER, posTracker, 'x');
          posTracker.advance();
          posTracker.advance();
          const expectedToken2: Token = createToken(TokenTypes.EQUALS, posTracker);
          posTracker.advance();
          posTracker.advance();
          const expectedToken3: Token = createToken(TokenTypes.NUMBER, posTracker, 3.1415);
          for (let i = 0; i < 6; i++) { posTracker.advance(); }
          const expectedToken4: Token = createToken(TokenTypes.NEWLINE, posTracker);

          const expected: Array<Token> = [expectedToken1, expectedToken2, expectedToken3,
                                          expectedToken4, eofToken];

          expect(tokens).toEqual(expected);
        });

        it('should return a list of correct tokens for complex single line variable assignment', () => {

          const sourceCode: string = 'variable = NOT ((1 >= 2) AND (23 < 11 OR 0 == 1))\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker1 = new PositionTracker(0, 1, 1);
          const posTracker2 = new PositionTracker(9, 1, 10);
          const posTracker3 = new PositionTracker(11, 1, 12);
          const posTracker4 = new PositionTracker(15, 1, 16);
          const posTracker5 = new PositionTracker(16, 1, 17);
          const posTracker6 = new PositionTracker(17, 1, 18);
          const posTracker7 = new PositionTracker(19, 1, 20);
          const posTracker8 = new PositionTracker(22, 1, 23);
          const posTracker9 = new PositionTracker(23, 1, 24);
          const posTracker10 = new PositionTracker(25, 1, 26);
          const posTracker11 = new PositionTracker(29, 1, 30);
          const posTracker12 = new PositionTracker(30, 1, 31);
          const posTracker13 = new PositionTracker(33, 1, 34);
          const posTracker14 = new PositionTracker(35, 1, 36);
          const posTracker15 = new PositionTracker(38, 1, 39);
          const posTracker16 = new PositionTracker(41, 1, 42);
          const posTracker17 = new PositionTracker(43, 1, 44);
          const posTracker18 = new PositionTracker(46, 1, 47);
          const posTracker19 = new PositionTracker(47, 1, 48);
          const posTracker20 = new PositionTracker(48, 1, 49);
          const posTracker21 = new PositionTracker(49, 1, 50);
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(50, 2, 1));

          const tokenData: Array<[string, PositionTracker, any?]> = [
            [TokenTypes.IDENTIFIER, posTracker1, 'variable'], [TokenTypes.EQUALS, posTracker2],
            [TokenTypes.KEYWORD, posTracker3, 'NOT'], [TokenTypes.L_BRACKET, posTracker4],
            [TokenTypes.L_BRACKET, posTracker5], [TokenTypes.NUMBER, posTracker6, 1],
            [TokenTypes.G_THAN_EQ, posTracker7], [TokenTypes.NUMBER, posTracker8, 2],
            [TokenTypes.R_BRACKET, posTracker9], [TokenTypes.KEYWORD, posTracker10, 'AND'],
            [TokenTypes.L_BRACKET, posTracker11], [TokenTypes.NUMBER, posTracker12, 23],
            [TokenTypes.L_THAN, posTracker13], [TokenTypes.NUMBER, posTracker14, 11],
            [TokenTypes.KEYWORD, posTracker15, 'OR'], [TokenTypes.NUMBER, posTracker16, 0],
            [TokenTypes.EQUALITY, posTracker17], [TokenTypes.NUMBER, posTracker18, 1],
            [TokenTypes.R_BRACKET, posTracker19], [TokenTypes.R_BRACKET, posTracker20],
            [TokenTypes.NEWLINE, posTracker21]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);
          expected.push(eofToken);

          expect(tokens).toEqual(expected);
        });
      });

      describe('If/else statement tokens tests', () => {
        it('should return list of correct tokens for source code with if/else statement', () => {

          const sourceCode: string = 'if (10 > 1 AND TRUE) then\nx = 1\nelse\nx = 2\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker1 = new PositionTracker(0, 1, 1); // if
          const posTracker2 = new PositionTracker(3, 1, 4); // (
          const posTracker3 = new PositionTracker(4, 1, 5); // 10
          const posTracker4 = new PositionTracker(7, 1, 8); // >
          const posTracker5 = new PositionTracker(9, 1, 10); // 1
          const posTracker6 = new PositionTracker(11, 1, 12); // AND
          const posTracker7 = new PositionTracker(15, 1, 16); // TRUE
          const posTracker8 = new PositionTracker(19, 1, 20); // )
          const posTracker9 = new PositionTracker(21, 1, 22); // then
          const posTracker10 = new PositionTracker(25, 1, 26); // \n
          const posTracker11 = new PositionTracker(26, 2, 1); // x
          const posTracker12 = new PositionTracker(28, 2, 3); // =
          const posTracker13 = new PositionTracker(30, 2, 5); // 1
          const posTracker14 = new PositionTracker(31, 2, 6); // \n
          const posTracker15 = new PositionTracker(32, 3, 1); // else
          const posTracker16 = new PositionTracker(36, 3, 5); // \n
          const posTracker17 = new PositionTracker(37, 4, 1); // x
          const posTracker18 = new PositionTracker(39, 4, 3); // =
          const posTracker19 = new PositionTracker(41, 4, 5); // 2
          const posTracker20 = new PositionTracker(42, 4, 6); // \n
          const posTracker21 = new PositionTracker(43, 5, 1); // end
          const posTracker22 = new PositionTracker(46, 5, 4); // \n
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(47, 6, 1));

          const tokenData: Array<[string, PositionTracker, any?]> = [
            [TokenTypes.KEYWORD, posTracker1, 'if'], [TokenTypes.L_BRACKET, posTracker2],
            [TokenTypes.NUMBER, posTracker3, 10], [TokenTypes.G_THAN, posTracker4],
            [TokenTypes.NUMBER, posTracker5, 1], [TokenTypes.KEYWORD, posTracker6, 'AND'],
            [TokenTypes.KEYWORD, posTracker7, 'TRUE'], [TokenTypes.R_BRACKET, posTracker8],
            [TokenTypes.KEYWORD, posTracker9, 'then'], [TokenTypes.NEWLINE, posTracker10],
            [TokenTypes.IDENTIFIER, posTracker11, 'x'], [TokenTypes.EQUALS, posTracker12],
            [TokenTypes.NUMBER, posTracker13, 1], [TokenTypes.NEWLINE, posTracker14],
            [TokenTypes.KEYWORD, posTracker15, 'else'], [TokenTypes.NEWLINE, posTracker16],
            [TokenTypes.IDENTIFIER, posTracker17, 'x'], [TokenTypes.EQUALS, posTracker18],
            [TokenTypes.NUMBER, posTracker19, 2], [TokenTypes.NEWLINE, posTracker20],
            [TokenTypes.KEYWORD, posTracker21, 'end'], [TokenTypes.NEWLINE, posTracker22]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);
          expected.push(eofToken);

          expect(tokens).toEqual(expected);
        });
      });

      describe('For/while loop tokens test', () => {
        it('should return list of correct tokens for source code with for loop', () => {

          const sourceCode: string = 'x = 1\nfor (i = 1 to 10) loop\nx = x * i\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker1 = new PositionTracker(0, 1, 1);
          const posTracker2 = new PositionTracker(2, 1, 3);
          const posTracker3 = new PositionTracker(4, 1, 5);
          const posTracker4 = new PositionTracker(5, 1, 6);
          const posTracker5 = new PositionTracker(6, 2, 1);
          const posTracker6 = new PositionTracker(10, 2, 5);
          const posTracker7 = new PositionTracker(11, 2, 6);
          const posTracker8 = new PositionTracker(13, 2, 8);
          const posTracker9 = new PositionTracker(15, 2, 10);
          const posTracker10 = new PositionTracker(17, 2, 12);
          const posTracker11 = new PositionTracker(20, 2, 15);
          const posTracker12 = new PositionTracker(22, 2, 17);
          const posTracker13 = new PositionTracker(24, 2, 19);
          const posTracker14 = new PositionTracker(28, 2, 23);
          const posTracker15 = new PositionTracker(29, 3, 1);
          const posTracker16 = new PositionTracker(31, 3, 3);
          const posTracker17 = new PositionTracker(33, 3, 5);
          const posTracker18 = new PositionTracker(35, 3, 7);
          const posTracker19 = new PositionTracker(37, 3, 9);
          const posTracker20 = new PositionTracker(38, 3, 10);
          const posTracker21 = new PositionTracker(39, 4, 1);
          const posTracker22 = new PositionTracker(42, 4, 4);
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(43, 5, 1));

          const tokenData: Array<[string, PositionTracker, any?]> = [
            [TokenTypes.IDENTIFIER, posTracker1, 'x'], [TokenTypes.EQUALS, posTracker2],
            [TokenTypes.NUMBER, posTracker3, 1], [TokenTypes.NEWLINE, posTracker4],
            [TokenTypes.KEYWORD, posTracker5, 'for'], [TokenTypes.L_BRACKET, posTracker6],
            [TokenTypes.IDENTIFIER, posTracker7, 'i'], [TokenTypes.EQUALS, posTracker8],
            [TokenTypes.NUMBER, posTracker9, 1], [TokenTypes.KEYWORD, posTracker10, 'to'],
            [TokenTypes.NUMBER, posTracker11, 10], [TokenTypes.R_BRACKET, posTracker12],
            [TokenTypes.KEYWORD, posTracker13, 'loop'], [TokenTypes.NEWLINE, posTracker14],
            [TokenTypes.IDENTIFIER, posTracker15, 'x'], [TokenTypes.EQUALS, posTracker16],
            [TokenTypes.IDENTIFIER, posTracker17, 'x'], [TokenTypes.MULTIPLY, posTracker18],
            [TokenTypes.IDENTIFIER, posTracker19, 'i'], [TokenTypes.NEWLINE, posTracker20],
            [TokenTypes.KEYWORD, posTracker21, 'end'], [TokenTypes.NEWLINE, posTracker22]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);
          expected.push(eofToken);

          expect(tokens).toEqual(expected);
        });

        it('should return list of correct tokens for source code with while loop', () => {

          const sourceCode: string = 'x = 10\ni = 1\nwhile (i < x) loop\ni = i + 1\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker1 = new PositionTracker(0, 1, 1);
          const posTracker2 = new PositionTracker(2, 1, 3);
          const posTracker3 = new PositionTracker(4, 1, 5);
          const posTracker4 = new PositionTracker(6, 1, 7);
          const posTracker5 = new PositionTracker(7, 2, 1);
          const posTracker6 = new PositionTracker(9, 2, 3);
          const posTracker7 = new PositionTracker(11, 2, 5);
          const posTracker8 = new PositionTracker(12, 2, 6);
          const posTracker9 = new PositionTracker(13, 3, 1);
          const posTracker10 = new PositionTracker(19, 3, 7);
          const posTracker11 = new PositionTracker(20, 3, 8);
          const posTracker12 = new PositionTracker(22, 3, 10);
          const posTracker13 = new PositionTracker(24, 3, 12);
          const posTracker14 = new PositionTracker(25, 3, 13);
          const posTracker15 = new PositionTracker(27, 3, 15);
          const posTracker16 = new PositionTracker(31, 3, 19);
          const posTracker17 = new PositionTracker(32, 4, 1);
          const posTracker18 = new PositionTracker(34, 4, 3);
          const posTracker19 = new PositionTracker(36, 4, 5);
          const posTracker20 = new PositionTracker(38, 4, 7);
          const posTracker21 = new PositionTracker(40, 4, 9);
          const posTracker22 = new PositionTracker(41, 4, 10);
          const posTracker23 = new PositionTracker(42, 5, 1);
          const posTracker24 = new PositionTracker(45, 5, 4);
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(46, 6, 1));

          const tokenData: Array<[string, PositionTracker, any?]> = [
            [TokenTypes.IDENTIFIER, posTracker1, 'x'], [TokenTypes.EQUALS, posTracker2],
            [TokenTypes.NUMBER, posTracker3, 10], [TokenTypes.NEWLINE, posTracker4],
            [TokenTypes.IDENTIFIER, posTracker5, 'i'], [TokenTypes.EQUALS, posTracker6],
            [TokenTypes.NUMBER, posTracker7, 1], [TokenTypes.NEWLINE, posTracker8],
            [TokenTypes.KEYWORD, posTracker9, 'while'], [TokenTypes.L_BRACKET, posTracker10],
            [TokenTypes.IDENTIFIER, posTracker11, 'i'], [TokenTypes.L_THAN, posTracker12],
            [TokenTypes.IDENTIFIER, posTracker13, 'x'], [TokenTypes.R_BRACKET, posTracker14],
            [TokenTypes.KEYWORD, posTracker15, 'loop'], [TokenTypes.NEWLINE, posTracker16],
            [TokenTypes.IDENTIFIER, posTracker17, 'i'], [TokenTypes.EQUALS, posTracker18],
            [TokenTypes.IDENTIFIER, posTracker19, 'i'], [TokenTypes.PLUS, posTracker20],
            [TokenTypes.NUMBER, posTracker21, 1], [TokenTypes.NEWLINE, posTracker22],
            [TokenTypes.KEYWORD, posTracker23, 'end'], [TokenTypes.NEWLINE, posTracker24]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);
          expected.push(eofToken);

          expect(tokens).toEqual(expected);
        });
      });

      describe('Function calls/definitions token tests', () => {
        it('should return list of correct tokens for source code with function definition', () => {

          const sourceCode: string = 'function add(x, y) begin\nreturn x + y\nend\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker1 = new PositionTracker(0, 1, 1);
          const posTracker2 = new PositionTracker(9, 1, 10);
          const posTracker3 = new PositionTracker(12, 1, 13);
          const posTracker4 = new PositionTracker(13, 1, 14);
          const posTracker5 = new PositionTracker(14, 1, 15);
          const posTracker6 = new PositionTracker(16, 1, 17);
          const posTracker7 = new PositionTracker(17, 1, 18);
          const posTracker8 = new PositionTracker(19, 1, 20);
          const posTracker9 = new PositionTracker(24, 1, 25);
          const posTracker10 = new PositionTracker(25, 2, 1);
          const posTracker11 = new PositionTracker(32, 2, 8);
          const posTracker12 = new PositionTracker(34, 2, 10);
          const posTracker13 = new PositionTracker(36, 2, 12);
          const posTracker14 = new PositionTracker(37, 2, 13);
          const posTracker15 = new PositionTracker(38, 3, 1);
          const posTracker16 = new PositionTracker(41, 3, 4);
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(42, 4, 1));

          const tokenData: Array<[string, PositionTracker, any?]> = [
            [TokenTypes.KEYWORD, posTracker1, 'function'],
            [TokenTypes.IDENTIFIER, posTracker2, 'add'], [TokenTypes.L_BRACKET, posTracker3],
            [TokenTypes.IDENTIFIER, posTracker4, 'x'], [TokenTypes.COMMA, posTracker5],
            [TokenTypes.IDENTIFIER, posTracker6, 'y'], [TokenTypes.R_BRACKET, posTracker7],
            [TokenTypes.KEYWORD, posTracker8, 'begin'], [TokenTypes.NEWLINE, posTracker9],
            [TokenTypes.IDENTIFIER, posTracker10, 'return'],
            [TokenTypes.IDENTIFIER, posTracker11, 'x'], [TokenTypes.PLUS, posTracker12],
            [TokenTypes.IDENTIFIER, posTracker13, 'y'], [TokenTypes.NEWLINE, posTracker14],
            [TokenTypes.KEYWORD, posTracker15, 'end'], [TokenTypes.NEWLINE, posTracker16]
          ];

          const expected: Array<Token> = createTokenArray(tokenData);
          expected.push(eofToken);

          expect(tokens).toEqual(expected);
        });

        it('should return list of correct tokens for source code with function call', () => {

          const sourceCode: string = 'output(10)\n';
          const lexer: Lexer = new Lexer();

          const tokens: Array<Token> | Error = lexer.lex(sourceCode);

          const posTracker = new PositionTracker(0, 1, 1);
          const eofToken: Token = createToken(TokenTypes.EOF, new PositionTracker(11, 2, 1));
          const expectedToken1: Token = createToken(TokenTypes.IDENTIFIER, posTracker, 'output');
          for (let i = 0; i < 6; i++) { posTracker.advance(); }
          const expectedToken2: Token = createToken(TokenTypes.L_BRACKET, posTracker);
          posTracker.advance();
          const expectedToken3: Token = createToken(TokenTypes.NUMBER, posTracker, 10);
          posTracker.advance();
          posTracker.advance();
          const expectedToken4: Token = createToken(TokenTypes.R_BRACKET, posTracker);
          posTracker.advance();
          const expectedToken5: Token = createToken(TokenTypes.NEWLINE, posTracker);

          const expected: Array<Token> = [expectedToken1, expectedToken2, expectedToken3,
                                          expectedToken4, expectedToken5, eofToken];

          expect(tokens).toEqual(expected);
        });
      });
    });

    describe('Error case tests', () => {
      it('should return appropriate error for assigning number with more than one decimal point', () => {

        const sourceCode: string = 'x = 1.2.1\n';
        const lexer: Lexer = new Lexer();

        const error: Array<Token> | Error = lexer.lex(sourceCode);

        const posStart = new PositionTracker(4, 1, 5);
        const posEnd = new PositionTracker(5, 1, 6);
        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = 'number has more than one decimal point.';
        const expected: Error = new Error(expectErrorType, posStart, posEnd, expectErrorDetails);

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

        const posStart = new PositionTracker(2, 1, 3);
        const posEnd = new PositionTracker(3, 1, 4);
        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `can not end line statement with '='.`;
        const expected: Error = new Error(expectErrorType, posStart, posEnd, expectErrorDetails);

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

        const posStart = new PositionTracker(2, 1, 3);
        const posEnd = new PositionTracker(3, 1, 4);
        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `can not end line statement with '>'.`;
        const expected: Error = new Error(expectErrorType, posStart, posEnd, expectErrorDetails);

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

        const posStart = new PositionTracker(2, 1, 3);
        const posEnd = new PositionTracker(3, 1, 4);
        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `can not end line statement with '<'.`;
        const expected: Error = new Error(expectErrorType, posStart, posEnd, expectErrorDetails);

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

        const posStart = new PositionTracker(1, 1, 2);
        const posEnd = new PositionTracker(2, 1, 3);
        const expectErrorType = 'InvalidCharacterError';
        const expectErrorDetails = `the character '@' is not valid.`;
        const expected: Error = new Error(expectErrorType, posStart, posEnd, expectErrorDetails);

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

function createTokenArray(tokenData: Array<[string, PositionTracker, any?]>): Array<Token> {

  let tokens: Array<Token> = [];

  for (let data of tokenData) {
    let token: Token;

    if (data.length === 2) {
      token = createToken(data[0], data[1]);
    }
    else {
      token = createToken(data[0], data[1], data[2]);
    }

    tokens.push(token);
  }

  return tokens;
}
