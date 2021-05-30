import { InvalidSyntaxError } from './invalid-syntax-error';

describe('InvalidSyntaxError tests', () => {
  describe('getErrorMessage tests', () => {
    it(`should return error message with type as 'InvalidSyntaxError' and details as passed`, () => {

      const details = `missing ')'.`;
      const error: InvalidSyntaxError = new InvalidSyntaxError(details);
      const expected = `InvalidSyntaxError: ${details}`;

      expect(error.getErrorMessage()).toEqual(expected);
    });
  });
});
