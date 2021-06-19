import { PositionTracker } from './position-tracker';

export class Error {

    constructor(protected type: string, protected posStart: PositionTracker,
                protected posEnd: PositionTracker, protected details?: string) {}

    public getErrorMessage(): string {

      const lineMessage = `At line: ${this.posStart.getLine()} column: ` +
                          `${this.posStart.getColumn()} and ends at line: ` +
                          `${this.posEnd.getLine()} column: ${this.posEnd.getColumn()}`;

      if (this.details === undefined) {
        return `${this.type}\n${lineMessage}`;
      }
      else {
        let message = `${this.type}: ${this.details}\n${lineMessage}`;
        return message;
      }
    }
}
