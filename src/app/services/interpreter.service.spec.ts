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
  });
});
