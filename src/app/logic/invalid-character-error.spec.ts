import { InvalidCharacterError } from './invalid-character-error';

describe('InvalidCharacterError tests', () => {
  describe('getErrorMessage tests', () => {
    it(`should return error message with type as 'InvalidCharacterError' and details as passed`, () => {

      const details = `character '@' is invalid.`;
      const error: InvalidCharacterError = new InvalidCharacterError(details);
      const expected = `InvalidCharacterError: ${details}`;

      expect(error.getErrorMessage()).toEqual(expected);
    });
  });
});
