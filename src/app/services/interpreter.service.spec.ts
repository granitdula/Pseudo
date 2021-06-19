import { TestBed } from '@angular/core/testing';

import { InterpreterService } from './interpreter.service';

describe('InterpreterService', () => {
  let service: InterpreterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterpreterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('evaluate tests', () => {
    describe('arithmetic expressions', () => {
      describe('valid expression tests', () => {
        it(`should return empty console output with shell output '3' for expression: 1 * 2 + 4 / 2 ^ 2`, () => {
          service = new InterpreterService();
          const source = '1 * 2 + 4 / 2 ^ 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('3');
        });

        it(`should return empty console output with shell output '1' for expression: (-1) ^ 2`, () => {
          service = new InterpreterService();
          const source = '(-1) ^ 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should return empty console output with shell output '1' for expression: 5 ^ 0`, () => {
          service = new InterpreterService();
          const source = '5 ^ 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should return empty console output with shell output '27' for expression: 9 ^ 1.5`, () => {
          service = new InterpreterService();
          const source = '9 ^ 1.5';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('27');
        });

        it(`should return empty console output with shell output '0.2' for expression: 5 ^ -1`, () => {
          service = new InterpreterService();
          const source = '5 ^ -1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0.2');
        });

        it(`should return empty console output with shell output '-27' for expression: -((1 + 0.5) / (1 - 0.5)) ^ 3`, () => {
          service = new InterpreterService();
          const source = '-((1 + 0.5) / (1 - 0.5)) ^ 3';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('-27');
        });
      });

      describe('erroneous expression tests', () => {
        it(`should return character error in console output and shell output for expression: @ + 1`, () => {
          service = new InterpreterService();
          const source = '@ + 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidCharacterError: the character '@' is not valid.\nAt` +
                              ` line: 1 column: 1 and ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it(`should return character error in console output and shell output for expression: 1 + 1..50`, () => {
          service = new InterpreterService();
          const source = '1 + 1..50';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidCharacterError: number has more than one decimal point.\n` +
                              `At line: 1 column: 5 and ends at line: 1 column: 6`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it(`should return missing ')' error in console output and shell output for expression: -((1 + 0.5) / (1 - 0.5) ^ 3`, () => {
          service = new InterpreterService();
          const source = '-((1 + 0.5) / (1 - 0.5) ^ 3';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidSyntaxError: missing ')'\nAt line: 1 column: 28 and ends` +
                              ` at line: 1 column: 29`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it(`should return operator syntax error in console output and shell output for expression: 1 2`, () => {
          service = new InterpreterService();
          const source = '1 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidSyntaxError: Expected '+', '-', '*', '/', '^', '==', ` +
                              `'<', '>', '<=', '>=', 'AND' or 'OR'\nAt line: 1 column: 3 and` +
                              ` ends at line: 1 column: 4`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it(`should return runtime error in console output and shell output for expression: 10 / 0`, () => {
          service = new InterpreterService();
          const source = '10 / 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 2, in <pseudo>\n` +
                              `Runtime Error: Division by zero\nAt line: 1 column: 6 and ends` +
                              ` at line: 1 column: 7`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });
      });
    });

    describe('variable assignment and access tests', () => {
      describe('variable assignment tests', () => {
        it(`should produce shell output of '1' for expression: var = 1`, () => {
          service = new InterpreterService();
          const source = 'var = 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce shell output of '-27' for expression: var = -((1 + 0.5) / (1 - 0.5)) ^ 3`, () => {
          service = new InterpreterService();
          const source = 'var = -((1 + 0.5) / (1 - 0.5)) ^ 3';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('-27');
        });

        it(`should produce shell output of '4' for expression: 1 + (var = 1) + 2`, () => {
          service = new InterpreterService();
          const source = '1 + (var = 1) + 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('4');
        });

        it(`should produce shell output of '4' for expression: var = 1 + (var = 1) + 2`, () => {
          service = new InterpreterService();
          const source = 'var = 1 + (var = 1) + 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('4');
        });

        it(`should produce a character error for console and shell output for expression: var =`, () => {
          service = new InterpreterService();
          const source = 'var =';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidCharacterError: can not end line statement with '='.\n` +
                              `At line: 1 column: 5 and ends at line: 1 column: 6`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it(`should produce a operator syntax error for console and shell output for expression: 1 + var = 1 + 2`, () => {
          service = new InterpreterService();
          const source = '1 + var = 1 + 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidSyntaxError: Expected '+', '-', '*', '/', '^', '==', ` +
                              `'<', '>', '<=', '>=', 'AND' or 'OR'\nAt line: 1 column: 9 and` +
                              ` ends at line: 1 column: 10`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });
      });

      describe('variable access tests', () => {
        it(`should produce shell output of '4.14159...' for expression (using the PI global pre-built variable): 1 + PI`, () => {
          service = new InterpreterService();
          const source = '1 + PI';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual((1 + Math.PI).toString());
        });

        it(`should produce shell output of '3.14159...' for expression (using the PI global pre-built variable): var = PI`, () => {
          service = new InterpreterService();
          const source = 'var = PI';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual((Math.PI).toString());
        });

        it(`should produce undefined variable runtime error for console and shell output for expression: x + 1`, () => {
          service = new InterpreterService();
          const source = 'x + 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 2, in <pseudo>\n` +
                              `Runtime Error: x is not defined\nAt line: 1 column: 1 and` +
                              ` ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });
      });
    });

    describe('comparison operator and logical operator tests', () => {
      describe('comparison operator tests', () => {
        it(`should produce a shell output of '1' for expression: 10 == 10`, () => {
          service = new InterpreterService();
          const source = '10 == 10';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '0' for expression: 10 > 10`, () => {
          service = new InterpreterService();
          const source = '10 > 10';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '1' for expression: (2 ^ 2) < ((1 + 2) * 3)`, () => {
          service = new InterpreterService();
          const source = '(2 ^ 2) < ((1 + 2) * 3)';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '1' for expression: (2 ^ 2) <= ((1 + 2) * 3)`, () => {
          service = new InterpreterService();
          const source = '(2 ^ 2) <= ((1 + 2) * 3)';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '0' for expression: 5 >= 6`, () => {
          service = new InterpreterService();
          const source = '5 >= 6';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '1' for expression: TRUE == TRUE`, () => {
          service = new InterpreterService();
          const source = 'TRUE == TRUE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '0' for expression: TRUE == FALSE`, () => {
          service = new InterpreterService();
          const source = 'TRUE == FALSE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '1' for expression: FALSE == FALSE`, () => {
          service = new InterpreterService();
          const source = 'FALSE == FALSE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '1' for expression: TRUE > FALSE`, () => {
          service = new InterpreterService();
          const source = 'TRUE > FALSE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '1' for expression: 10 > TRUE`, () => {
          service = new InterpreterService();
          const source = '10 > TRUE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });
      });

      describe('logical operator tests', () => {
        it(`should produce a shell output of '1' for expression: 1 AND 1`, () => {
          service = new InterpreterService();
          const source = '1 AND 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '0' for expression: 1 AND 0`, () => {
          service = new InterpreterService();
          const source = '1 AND 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '0' for expression: 0 AND 1`, () => {
          service = new InterpreterService();
          const source = '0 AND 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '0' for expression: 0 AND 0`, () => {
          service = new InterpreterService();
          const source = '0 AND 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '0' for expression: TRUE AND FALSE`, () => {
          service = new InterpreterService();
          const source = 'TRUE AND FALSE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '0' for expression: 0 OR 0`, () => {
          service = new InterpreterService();
          const source = '0 OR 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '1' for expression: 1 OR 0`, () => {
          service = new InterpreterService();
          const source = '1 OR 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '1' for expression: 1 OR 1`, () => {
          service = new InterpreterService();
          const source = '1 OR 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '1' for expression: TRUE OR FALSE`, () => {
          service = new InterpreterService();
          const source = 'TRUE OR FALSE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '0' for expression: NOT 1`, () => {
          service = new InterpreterService();
          const source = 'NOT 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '1' for expression: NOT 0`, () => {
          service = new InterpreterService();
          const source = 'NOT 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a shell output of '0' for expression: NOT TRUE`, () => {
          service = new InterpreterService();
          const source = 'NOT TRUE';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('0');
        });

        it(`should produce a shell output of '1' for expression: NOT ((1 > 2) AND (TRUE OR FALSE))`, () => {
          service = new InterpreterService();
          const source = 'NOT ((1 > 2) AND (TRUE OR FALSE))';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it(`should produce a console and shell output an error for expression: TRUE AND`, () => {
          service = new InterpreterService();
          const source = 'TRUE AND';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidSyntaxError: Expected a number, identifier, '+', '-' or ` +
                              `'('\nAt line: 1 column: 9 and ends at line: 1 column: 10`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });
      });
    });
  });
});
