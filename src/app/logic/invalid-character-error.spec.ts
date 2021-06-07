import { InvalidCharacterError } from './invalid-character-error';
import { PositionTracker } from './position-tracker';

describe('InvalidCharacterError tests', () => {
  describe('getErrorMessage tests', () => {
    it(`should return error message with type as 'InvalidCharacterError' and details as passed with correct line and column number`, () => {

      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const details = `character '@' is invalid.`;
      const error: InvalidCharacterError = new InvalidCharacterError(details, posStart, posEnd);
      const expected = `InvalidCharacterError: ${details}\nAt line: ${posStart.getLine()} column:` +
                       ` ${posStart.getColumn()} and ends at line: ${posEnd.getLine()} column:` +
                       ` ${posEnd.getColumn()}`;

      expect(error.getErrorMessage()).toEqual(expected);
    });
  });
});
