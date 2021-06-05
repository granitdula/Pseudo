import { InvalidSyntaxError } from './invalid-syntax-error';
import { PositionTracker } from './position-tracker';

describe('InvalidSyntaxError tests', () => {
  describe('getErrorMessage tests', () => {
    it(`should return error message with type as 'InvalidSyntaxError' and details as passed with correct line and column number`, () => {

      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const details = `missing ')'.`;
      const error: InvalidSyntaxError = new InvalidSyntaxError(details, posStart, posEnd);
      const expected = `InvalidSyntaxError: ${details}\nAt line: ${posStart.getLine()} column:` +
                       ` ${posStart.getColumn()} and ends at line: ${posEnd.getLine()} column:` +
                       ` ${posEnd.getColumn()}`;

      expect(error.getErrorMessage()).toEqual(expected);
    });
  });
});
