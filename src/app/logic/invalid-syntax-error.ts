import { Error } from './error';

export class InvalidSyntaxError extends Error {

  constructor(details: string) {
    super('InvalidSyntaxError', details);
  }
}
