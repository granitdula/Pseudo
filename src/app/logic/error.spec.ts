import { PositionTracker } from './position-tracker';
import { Error } from './error';

describe('Error tests', () => {
  describe('getErrorMessage tests', () => {
    it(`should return 'Error' with line and column numbers for type='Error' and no details passed`, () => {

      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const error: Error = new Error('Error', posStart, posEnd);
      const expected = `Error\nAt line: ${posStart.getLine()} column: ${posStart.getColumn()}` +
                       ` and ends at line: ${posEnd.getLine()} column: ${posEnd.getColumn()}`;

      expect(error.getErrorMessage()).toEqual(expected);
    });

    it(`should return 'Error: details' with line and column numbers for type='Error' and details='details'`, () => {

      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const error: Error = new Error('Error', posStart, posEnd, 'details');
      const expected = `Error: details\nAt line: ${posStart.getLine()} column: ${posStart.getColumn()}` +
                       ` and ends at line: ${posEnd.getLine()} column: ${posEnd.getColumn()}`;

      expect(error.getErrorMessage()).toEqual(expected);
    });
  });
});
