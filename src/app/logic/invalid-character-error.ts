import { PositionTracker } from './position-tracker';
import { Error } from './error';

export class InvalidCharacterError extends Error {

  constructor(details: string, posStart: PositionTracker, posEnd: PositionTracker) {
    super('InvalidCharacterError', posStart, posEnd, details);
  }
}
