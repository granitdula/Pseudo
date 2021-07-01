import { RuntimeError } from './runtime-error';
import { Context } from './context';
import { PositionTracker } from './position-tracker';

describe('RuntimeError tests', () => {
  describe('getErrorMessage tests', () => {
    it('should have error message with single traceback for null parent context for runtime error', () => {
      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const context = new Context('<pseudo>');
      const runtimeError = new RuntimeError('Division by zero', posStart, posEnd, context);
      const positionDetails = `At line: ${posStart.getLine()} column: ` +
                              `${posStart.getColumn()} and ends at line: ` +
                              `${posEnd.getLine()} column: ${posEnd.getColumn()}`;

      const expected = `Traceback (most recent call last):\nLine ${posStart.getLine()}, ` +
                       `in ${context.getContextName()}\nRuntime Error: Division by zero\n` +
                       `${positionDetails}`;

      expect(runtimeError.getErrorMessage()).toEqual(expected);
    });

    it('should have error message with full traceback for parented context for runtime error', () => {
      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const posStartParent = new PositionTracker(25, 5, 1);
      const parentContext = new Context('<pseudo>');
      const context = new Context('function', parentContext, posStartParent);
      const runtimeError = new RuntimeError('Division by zero', posStart, posEnd, context);
      const positionDetails = `At line: ${posStart.getLine()} column: ` +
                              `${posStart.getColumn()} and ends at line: ` +
                              `${posEnd.getLine()} column: ${posEnd.getColumn()}`;

      const tracebackDetails = `Traceback (most recent call last):\nLine ` +
                               `${posStartParent.getLine()}, in ` +
                               `${parentContext.getContextName()}\nLine ` +
                               `${posStart.getLine()}, in ${context.getContextName()}\n`;

      const expected = `${tracebackDetails}Runtime Error: Division by zero\n${positionDetails}`;

      expect(runtimeError.getErrorMessage()).toEqual(expected);
    });
  });
});
