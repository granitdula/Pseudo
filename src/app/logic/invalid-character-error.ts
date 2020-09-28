import { Error } from './error';

export class InvalidCharacterError extends Error {

  constructor(details: string) {
    super('InvalidCharacterError', details);
  }
}
