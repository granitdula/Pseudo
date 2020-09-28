import { Error } from './error';

describe('Error tests', () => {
  describe('getErrorMessage tests', () => {
    it(`should return 'Error' for type='Error' and no details passed`, () => {

      const error: Error = new Error('Error');
      const expected = 'Error';

      expect(error.getErrorMessage()).toEqual(expected);
    });

    it(`should return 'Error: details' for type='Error' and details='details'`, () => {

      const error: Error = new Error('Error', 'details');
      const expected = 'Error: details';

      expect(error.getErrorMessage()).toEqual(expected);
    });
  });
});
