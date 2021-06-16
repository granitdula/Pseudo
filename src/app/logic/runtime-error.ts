import { Context } from './context';
import { Error } from './error';
import { PositionTracker } from './position-tracker';

export class RuntimeError extends Error {
  constructor(details: string, posStart: PositionTracker, posEnd: PositionTracker,
              private context: Context) {
    super('Runtime Error', posStart, posEnd, details);
  }

  public getErrorMessage(): string {
    const positionDetails = `At line: ${this.posStart.getLine()} column: ` +
                            `${this.posStart.getColumn()} and ends at line: ` +
                            `${this.posEnd.getLine()} column: ${this.posEnd.getColumn()}`;

    let result = this.generateTraceback();
    result += `${this.type}: ${this.details}\n${positionDetails}`;

    return result;
  }

  private generateTraceback(): string {
    let result = '';
    let pos = this.posStart;
    let ctx = this.context;

    while (ctx !== null) {
      result = `Line ${pos.getLine() + 1}, in ${ctx.getContextName()}\n` + result;
      pos = ctx.getParentEntryPos();
      ctx = ctx.getParent();
    }

    return 'Traceback (most recent call last):\n' + result;
  }
}
