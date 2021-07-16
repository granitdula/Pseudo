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

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\n` +
                              `Runtime Error: Division by zero\nAt line: 1 column: 6 and ends` +
                              ` at line: 1 column: 7`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });
      });
    });

    describe('string expression tests', () => {
      describe('valid string expression tests', () => {
        it(`should return empty console output with shell output 'string' for expression: "string"`, () => {
          service = new InterpreterService();
          const source = '"string"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('string');
        });

        it(`should return empty console output with shell output 'string \t " \n' for expression: "string \t \\" \n"`, () => {
          service = new InterpreterService();
          const source = '"string \t \\" \n"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('string \t " \n');
        });

        it(`should return empty console output with shell output 'string concat' for expression: "string" + " concat"`, () => {
          service = new InterpreterService();
          const source = '"string" + " concat"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('string concat');
        });

        it(`should return empty console output with shell output 'hello hello ' for expression: "hello " * 2`, () => {
          service = new InterpreterService();
          const source = '"hello " * 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('hello hello ');
        });

        it(`should return empty console output with shell output '' for expression: "hello " * 0`, () => {
          service = new InterpreterService();
          const source = '"hello " * 0';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('');
        });

        it(`should return empty console output with shell output 'hello! hello! World!' for expression: "hello! " * 2 + "World!"`, () => {
          service = new InterpreterService();
          const source = '"hello! " * 2 + "World!"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('hello! hello! World!');
        });
      });

      describe('erroneous string expression tests', () => {
        it('should return syntax error in console/shell output for expression: "hello', () => {
          service = new InterpreterService();
          const source = '"hello';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidCharacterError: missing closing " in string\n` +
                              `At line: 1 column: 7 and ends at line: 1 column: 8`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return syntax error in console/shell output for expression: "hello\\"', () => {
          service = new InterpreterService();
          const source = '"hello\\"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidCharacterError: missing closing " in string\n` +
                              `At line: 1 column: 9 and ends at line: 1 column: 10`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: "age: " + 1', () => {
          service = new InterpreterService();
          const source = '"age: " + 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: Illegal operation\nAt line: 1 column: 1 and ends at ` +
                              `line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: "hello" * -1', () => {
          service = new InterpreterService();
          const source = '"hello" * -1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: Multiplied string by negative value\nAt line: 1 column: ` +
                              `11 and ends at line: 1 column: 12`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });
      });
    });

    describe('list expression and function tests', () => {
      describe('valid list expression tests', () => {
        it(`should return empty console output with shell output '[]' for expression: []`, () => {
          service = new InterpreterService();
          const source = '[]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[]');
        });

        it(`should return empty console output with shell output '[1, 2, string]' for expression: [1, 2, "string"]`, () => {
          service = new InterpreterService();
          const source = '[1, 2, "string"]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, string]');
        });

        it(`should return empty console output with shell output '[1, <function x>]' for expression: [1, function x() begin 1 end]`, () => {
          service = new InterpreterService();
          const source = '[1, function x() begin 1 end]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, <function x>]');
        });

        it(`should return empty console output with shell output '[1, 2, 3]' for expression: [1, 2, 1+2]`, () => {
          service = new InterpreterService();
          const source = '[1, 2, 1+2]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, 3]');
        });

        it(`should return empty console output with shell output '[[1,2], [0,0]]' for expression: [[1,2], [0,0]]`, () => {
          service = new InterpreterService();
          const source = '[[1,2], [0,0]]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[[1, 2], [0, 0]]');
        });

        it(`should return empty console output with shell output '[1, 2, 1]' for expression: [1, 2] + 1`, () => {
          service = new InterpreterService();
          const source = '[1, 2] + 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, 1]');
        });

        it(`should return empty console output with shell output '[1, 2, [string]]' for expression: [1, 2] + ["string"]`, () => {
          service = new InterpreterService();
          const source = '[1, 2] + ["string"]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, [string]]');
        });

        it(`should return empty console output with shell output '[1, 3]' for expression: [1, 2, 3] - 1`, () => {
          service = new InterpreterService();
          const source = '[1, 2, 3] - 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 3]');
        });

        it(`should return empty console output with shell output '[1, 2]' for expression: [1, 2, 3] - -1`, () => {
          service = new InterpreterService();
          const source = '[1, 2, 3] - -1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2]');
        });

        it(`should return empty console output with shell output '[1, 2, 3, 4]' for expression: [1, 2] * [3, 4]`, () => {
          service = new InterpreterService();
          const source = '[1, 2] * [3, 4]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, 3, 4]');
        });

        it(`should return empty console output with shell output '[1, 2]' for expression: [1, 2] * []`, () => {
          service = new InterpreterService();
          const source = '[1, 2] * []';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2]');
        });

        it(`should return empty console output with shell output '2' for expression: [1, 2, 3] ^ 1`, () => {
          service = new InterpreterService();
          const source = '[1, 2, 3] ^ 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('2');
        });

        it(`should return empty console output with shell output '3' for expression: [1, 2, 3] ^ -1`, () => {
          service = new InterpreterService();
          const source = '[1, 2, 3] ^ -1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('3');
        });

        it(`should return empty console output with shell output '[1, 2, 3]' for expression: [2, 3] < [0, 1]`, () => {
          service = new InterpreterService();
          const source = '[2, 3] < [0, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, 3]');
        });

        it(`should return empty console output with shell output '[2, 3, 1]' for expression: [2, 3] < [2, 1]`, () => {
          service = new InterpreterService();
          const source = '[2, 3] < [2, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[2, 3, 1]');
        });

        it(`should return empty console output with shell output '[2, 1, 3]' for expression: [2, 3] < [-1, 1]`, () => {
          service = new InterpreterService();
          const source = '[2, 3] < [-1, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[2, 1, 3]');
        });

        it(`should return empty console output with shell output '[1, 2, 3]' for expression: [2, 3] < [-2, 1]`, () => {
          service = new InterpreterService();
          const source = '[2, 3] < [-2, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, 3]');
        });
      });

      describe('erroneous list tests', () => {
        it('should return syntax error in console/shell output for expression: [', () => {
          service = new InterpreterService();
          const source = '[';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidSyntaxError: Expected either ']' or a valid expression ` +
                              `for a list element\nAt line: 1 column: 2 and ends at line: 1 column: 3`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return syntax error in console/shell output for expression: [1 2]', () => {
          service = new InterpreterService();
          const source = '[1 2]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidSyntaxError: Expected ',' or ']'\nAt line: 1 column: 4` +
                              ` and ends at line: 1 column: 5`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return syntax error in console/shell output for expression: [1, 2', () => {
          service = new InterpreterService();
          const source = '[1, 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `InvalidSyntaxError: Expected ',' or ']'\nAt line: 1 column: 6` +
                              ` and ends at line: 1 column: 7`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] - "string"', () => {
          service = new InterpreterService();
          const source = '[1, 2] - "string"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: Illegal operation\nAt line: 1 column: 1 and ends at line:` +
                              ` 1 column: 2`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] - 1.5', () => {
          service = new InterpreterService();
          const source = '[1, 2] - 1.5';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: right operand should be an integer\nAt line: 1 column: 10` +
                              ` and ends at line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] - 2', () => {
          service = new InterpreterService();
          const source = '[1, 2] - 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: index out of bounds\nAt line: 1 column: 10 and ends at ` +
                              `line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] - -3', () => {
          service = new InterpreterService();
          const source = '[1, 2] - -3';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: index out of bounds\nAt line: 1 column: 10 and ends at ` +
                              `line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] * 1', () => {
          service = new InterpreterService();
          const source = '[1, 2] * 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: Illegal operation\nAt line: 1 column: 1 and ends at ` +
                              `line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] ^ "string"', () => {
          service = new InterpreterService();
          const source = '[1, 2] ^ "string"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: Illegal operation\nAt line: 1 column: 1 and ends at ` +
                              `line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] ^ 1.5', () => {
          service = new InterpreterService();
          const source = '[1, 2] ^ 1.5';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: right operand should be an integer\nAt line: 1 column: 10` +
                              ` and ends at line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] ^ 2', () => {
          service = new InterpreterService();
          const source = '[1, 2] ^ 2';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: index out of bounds\nAt line: 1 column: 10 and ends at ` +
                              `line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] ^ -3', () => {
          service = new InterpreterService();
          const source = '[1, 2] ^ -3';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: index out of bounds\nAt line: 1 column: 10 and ends at ` +
                              `line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] < 1', () => {
          service = new InterpreterService();
          const source = '[1, 2] < 1';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: Illegal operation\nAt line: 1 column: 1 and ends at ` +
                              `line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] < [1, 1, 1]', () => {
          service = new InterpreterService();
          const source = '[1, 2] < [1, 1, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: list on the right should be of size 2 where index 0 is` +
                              ` the position and 1 is the element\nAt line: 1 column: 10 and ` +
                              `ends at line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] < ["string", 1]', () => {
          service = new InterpreterService();
          const source = '[1, 2] < ["string", 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: element at index 0 of list on the right should be an ` +
                              `integer\nAt line: 1 column: 10 and ends at line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] < [1.5, 1]', () => {
          service = new InterpreterService();
          const source = '[1, 2] < [1.5, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: element at index 0 of list on the right should be an ` +
                              `integer\nAt line: 1 column: 10 and ends at line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] < [3, 1]', () => {
          service = new InterpreterService();
          const source = '[1, 2] < [3, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: index out of bounds\nAt line: 1 column: 10 and ends at ` +
                              `line: 1 column: 11`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });

        it('should return runtime error in console/shell output for expression: [1, 2] < [-3, 1]', () => {
          service = new InterpreterService();
          const source = '[1, 2] < [-3, 1]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: index out of bounds\nAt line: 1 column: 10 and ends at ` +
                              `line: 1 column: 11`;

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

        it(`should produce shell output of 'string' for expression: var = "string"`, () => {
          service = new InterpreterService();
          const source = 'var = "string"';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('string');
        });

        it(`should produce shell output of '[1, 2, 3]' for expression: var = [1, 2, 3]`, () => {
          service = new InterpreterService();
          const source = 'var = [1, 2, 3]';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, 3]');
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

          const expectedErr = `Traceback (most recent call last):\nLine 1, in <pseudo>\n` +
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

          const expectedErr = `InvalidSyntaxError: Expected a number, identifier, '+', '-', '('` +
                              ` or '['\nAt line: 1 column: 9 and ends at line: 1 column: 10`;

          expect(consoleOut).toEqual(expectedErr);
          expect(shellOut).toEqual(expectedErr);
        });
      });
    });

    describe('if, elif and else statement tests', () => {
      it(`should produce a shell output of '2' for expression: if PI > 3 then 1 + 1`, () => {
        service = new InterpreterService();
        const source = 'if PI > 3 then 1 + 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('2');
      });

      it(`should produce a shell output of '100' for expression: if PI == 3 then 1 + 1 else 100`, () => {
        service = new InterpreterService();
        const source = 'if PI == 3 then 1 + 1 else 100';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('100');
      });

      it(`should produce a shell output of '1' for expression: if FALSE then 5 elif TRUE then 1 else 100`, () => {
        service = new InterpreterService();
        const source = 'if FALSE then 5 elif TRUE then 1 else 100';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('1');
      });

      it(`should produce a shell output of '0' for expression: if FALSE then 5 elif FALSE then 1 elif TRUE then 0 else 100`, () => {
        service = new InterpreterService();
        const source = 'if FALSE then 5 elif FALSE then 1 elif TRUE then 0 else 100';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('0');
      });

      it(`should produce a console/shell syntax error missing 'then' keyword for expression: if TRUE 5`, () => {
        service = new InterpreterService();
        const source = 'if TRUE 5';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedErr = `InvalidSyntaxError: Expected 'then' keyword\nAt line: 1 column:` +
                            ` 9 and ends at line: 1 column: 10`;

        expect(consoleOut).toEqual(expectedErr);
        expect(shellOut).toEqual(expectedErr);
      });

      it(`should produce a console/shell syntax error missing 'then' keyword for expression: if FALSE then 5 elif TRUE 1`, () => {
        service = new InterpreterService();
        const source = 'if FALSE then 5 elif TRUE 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedErr = `InvalidSyntaxError: Expected 'then' keyword\nAt line: 1 column:` +
                            ` 27 and ends at line: 1 column: 28`;

        expect(consoleOut).toEqual(expectedErr);
        expect(shellOut).toEqual(expectedErr);
      });
    });

    describe('for and while loop tests', () => {
      it('should produce an empty shell/console output for expression: for i = 1 to 10 loop 1', () => {
        service = new InterpreterService();
        const source = 'for i = 1 to 10 loop 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('');
      });

      it('should produce an empty shell/console output for expression: for i = 1 to 10 step 2 loop 1', () => {
        service = new InterpreterService();
        const source = 'for i = 1 to 10 step 2 loop 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('');
      });

      it('should produce an empty shell/console output for expression: for i = 10 to 0 step -1 loop 1', () => {
        service = new InterpreterService();
        const source = 'for i = 10 to 0 step -1 loop 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('');
      });

      // // NOTE: Has to be a false condition to prevent infinite loop during testing.
      it('should produce an empty shell/console output for expression: while FALSE loop 1 end', () => {
        service = new InterpreterService();
        const source = 'while FALSE loop 1 end';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('');
      });

      it(`should produce a missing '=' error shell/console output for expression: for i 1 to 10 loop 1`, () => {
        service = new InterpreterService();
        const source = 'for i 1 to 10 loop 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedErr = `InvalidSyntaxError: Expected '='\nAt line: 1 column: 7 and ends` +
                            ` at line: 1 column: 8`;

        expect(consoleOut).toEqual(expectedErr);
        expect(shellOut).toEqual(expectedErr);
      });

      it(`should produce a missing 'to' error shell/console output for expression: for i = 1 10 loop 1`, () => {
        service = new InterpreterService();
        const source = 'for i = 1 10 loop 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedErr = `InvalidSyntaxError: Expected 'to' keyword\nAt line: 1 column: 11 ` +
                            `and ends at line: 1 column: 12`;

        expect(consoleOut).toEqual(expectedErr);
        expect(shellOut).toEqual(expectedErr);
      });

      it(`should produce a missing 'loop' error shell/console output for expression: for i = 1 to 10 1`, () => {
        service = new InterpreterService();
        const source = 'for i = 1 to 10 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedErr = `InvalidSyntaxError: Expected 'loop' keyword\nAt line: 1 column: 17 ` +
                            `and ends at line: 1 column: 18`;

        expect(consoleOut).toEqual(expectedErr);
        expect(shellOut).toEqual(expectedErr);
      });

      it(`should produce a missing 'loop' error shell/console output for expression: while FALSE 1 end`, () => {
        service = new InterpreterService();
        const source = 'while FALSE 1 end';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedErr = `InvalidSyntaxError: Expected 'loop' keyword\nAt line: 1 column: 13 ` +
                            `and ends at line: 1 column: 14`;

        expect(consoleOut).toEqual(expectedErr);
        expect(shellOut).toEqual(expectedErr);
      });

      it(`should produce a missing 'end' error shell/console output for expression: while FALSE loop 1`, () => {
        service = new InterpreterService();
        const source = 'while FALSE loop 1';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedErr = `InvalidSyntaxError: Expected 'end' keyword\nAt line: 1 column: 19 ` +
                            `and ends at line: 1 column: 20`;

        expect(consoleOut).toEqual(expectedErr);
        expect(shellOut).toEqual(expectedErr);
      });
    });

    describe('function definition and calls tests', () => {
      it('should return function value by its name, when defined, in the shell output', () => {
        service = new InterpreterService();
        const source = 'function add(x, y) begin x + y end';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('function add');
      });

      it('should return function value by its name <anonymous>, when defined, in the shell output', () => {
        service = new InterpreterService();
        const source = 'function (x, y) begin x + y end';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('function <anonymous>');
      });

      // TODO: Add tests for normal function calls after supporting multiline code.
      // it('should return function output in the shell output when called', () => {

      // });

      it('should return a runtime error for calling a none FunctionType', () => {
        service = new InterpreterService();
        const source = 'randomFunc(x)';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedError = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: Can not make a call to a none FunctionType\nAt line: 1 ` +
                              `column: 1 and ends at line: 1 column: 2`;

        expect(consoleOut).toEqual(expectedError);
        expect(shellOut).toEqual(expectedError);
      });
    });

    describe('built-in function tests', () => {
      describe('toString function tests', () => {
        it('should return correct StringType when passing a StringType', () => {
          service = new InterpreterService();
          const source = 'toString("string")';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('string');
        });

        it('should return correct StringType when passing a NumberType', () => {
          service = new InterpreterService();
          const source = 'toString(1)';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('1');
        });

        it('should return correct StringType when passing a ListType', () => {
          service = new InterpreterService();
          const source = 'toString([1, 2, 3])';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('');
          expect(shellOut).toEqual('[1, 2, 3]');
        });

        it('should return runtime error when passing two StringType args', () => {
          service = new InterpreterService();
          const source = 'toString("two", "args")';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedError = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                              ` Error: toString function expects 1 argument\nAt line: 1 ` +
                              `column: 1 and ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedError);
          expect(shellOut).toEqual(expectedError);
        });

        it('should return runtime error when passing an argument that is a FunctionType', () => {
          service = new InterpreterService();
          const source = 'toString(function func() begin 1 end)';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedError = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                                ` Error: can not convert the type of the passed argument to a ` +
                                `StringType\nAt line: 1 column: 1 and ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedError);
          expect(shellOut).toEqual(expectedError);
        });
      });

      describe('output function tests', () => {
        it('should output the input StringType on both the console and shell output', () => {
          service = new InterpreterService();
          const source = 'output("string")';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('string');
          expect(shellOut).toEqual('string');
        });

        it('should output the input StringType with newline char on both the console and shell output', () => {
          service = new InterpreterService();
          const source = 'output("string\nHello world!")';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('string\nHello world!');
          expect(shellOut).toEqual('string\nHello world!');
        });

        it('should output the input toString result applied to a ListType on both the console and shell output', () => {
          service = new InterpreterService();
          const source = 'output(toString([1, 2, 3]))';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          expect(consoleOut).toEqual('[1, 2, 3]');
          expect(shellOut).toEqual('[1, 2, 3]');
        });

        it('should return runtime error when passing an argument that is a NumberType', () => {
          service = new InterpreterService();
          const source = 'output(1)';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedError = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                                ` Error: output function argument should be a string` +
                                `\nAt line: 1 column: 1 and ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedError);
          expect(shellOut).toEqual(expectedError);
        });

        it('should return runtime error when passing an argument that is a ListType', () => {
          service = new InterpreterService();
          const source = 'output(["string", "elements"])';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedError = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                                ` Error: output function argument should be a string` +
                                `\nAt line: 1 column: 1 and ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedError);
          expect(shellOut).toEqual(expectedError);
        });

        it('should return runtime error when passing an argument that is a FunctionType', () => {
          service = new InterpreterService();
          const source = 'output(function func() begin 1 end)';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedError = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                                ` Error: output function argument should be a string` +
                                `\nAt line: 1 column: 1 and ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedError);
          expect(shellOut).toEqual(expectedError);
        });

        it('should return runtime error when passing more than one argument', () => {
          service = new InterpreterService();
          const source = 'output(1, 2)';

          const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

          const expectedError = `Traceback (most recent call last):\nLine 1, in <pseudo>\nRuntime` +
                                ` Error: output function expects 1 string argument` +
                                `\nAt line: 1 column: 1 and ends at line: 1 column: 2`;

          expect(consoleOut).toEqual(expectedError);
          expect(shellOut).toEqual(expectedError);
        });
      });
    });

    // Block code is having multiple lines inside a function or if/elif/else/for/while loops.
    describe('multi-line code with no block code tests', () => {
      it('should output to shell a list of outputs for each line statement', () => {
        service = new InterpreterService();
        const source = 'function add(x, y) begin x + y end\nif add(3, 2) > 2 then TRUE\n"string"';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('[<function add>, 1, string]');
      });

      it('should show correct console output for valid multi-line code with output function used', () => {
        service = new InterpreterService();
        const source = 'final = 5\nx = 1\nwhile x < final loop x = x + 1 end\noutput(toString(x))';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('5');
        expect(shellOut).toEqual('5');
      });

      it('should show empty output for code filled with empty spaces and newlines', () => {
        service = new InterpreterService();
        const source = ' \n  \n\n   \n';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('');
      });

      it('should show runtime error output for erroneous code', () => {
        service = new InterpreterService();
        const source = 'x = 1\ny = 2\nresult = x + z\noutput(toString(result))';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedError = `Traceback (most recent call last):\nLine 3, in <pseudo>\nRuntime` +
                              ` Error: z is not defined\nAt line: 3 column: 14 and ends at ` +
                              `line: 3 column: 15`;

        expect(consoleOut).toEqual(expectedError);
        expect(shellOut).toEqual(expectedError);
      });
    });

    describe('multi-line code with block code tests', () => {
      it('should output correct variable value inside the block statement in the if statement', () => {
        service = new InterpreterService();
        const source = 'if 1 > 0 then\nx = 0\ny = 1\nend\noutput(toString(y))';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('1');
        expect(shellOut).toEqual('1');
      });

      it('should output correct variable value inside the block statement in the else statement', () => {
        service = new InterpreterService();
        const source = 'if 1 < 0 then\nx = 0\ny = 1\nelse\nx = 100\nend';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('');
        expect(shellOut).toEqual('[100]');
      });

      it('should output correct variable value inside the block statement in the elif statement', () => {
        service = new InterpreterService();
        const source = 'if 1 < 0 then\nx = 0\ny = 1\nelif 2 < 3 then\noutput("success")\nelse\nx = 100\nend';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('success');
        expect(shellOut).toEqual('success');
      });

      it(`should output syntax error for block if, elif and else statement missing 'end' keyword`, () => {
        service = new InterpreterService();
        const source = 'if 1 < 0 then\nx = 0\ny = 1\nelif 2 < 3 then\noutput("success")\nelse\nx = 100';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        const expectedError = `InvalidSyntaxError: Expected 'end' keyword\nAt line: 7 column:` +
                              ` 8 and ends at line: 7 column: 9`;

        expect(consoleOut).toEqual(expectedError);
        expect(shellOut).toEqual(expectedError);
      });

      it('should output correct variable value inside the block statement in the for statement', () => {
        service = new InterpreterService();
        const source = 'for i = 1 to 5 loop\nx = i + 1\noutput(toString(x))\nend';

        const [consoleOut, shellOut]: [string, string] = service.evaluate(source);

        expect(consoleOut).toEqual('2\n3\n4\n5\n6');
        expect(shellOut).toEqual('2\n3\n4\n5\n6');
      });
    });
  });
});
