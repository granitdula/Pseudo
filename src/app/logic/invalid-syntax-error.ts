import { PositionTracker } from './position-tracker';
import { Error } from './error';

export class InvalidSyntaxError extends Error {

  constructor(details: string, posStart: PositionTracker, posEnd: PositionTracker) {
    super('InvalidSyntaxError', posStart, posEnd, details);
  }
}
