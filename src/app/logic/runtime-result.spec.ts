import { ValueType } from './../data-types/value-type';
import { Context } from './context';
import { PositionTracker } from './position-tracker';
import { RuntimeError } from './runtime-error';
import { NumberType } from './../data-types/number-type';
import { RuntimeResult } from './runtime-result';

describe('RuntimeResult tests', () => {
  it('should initialise value and error attributes as null', () => {
    const parseResult = new RuntimeResult();

    expect(parseResult.getError()).toEqual(null);
    expect(parseResult.getValue()).toEqual(null);
  });

  describe('success tests', () => {
    it('should return a value instance and null error when using getter, after calling success', () => {
      const number = new NumberType(10);
      const runtimeResult = new RuntimeResult();

      const returnedRuntimeResult: RuntimeResult = runtimeResult.success(number);

      expect(returnedRuntimeResult).toEqual(runtimeResult);
      expect(runtimeResult.getValue()).toEqual(number);
      expect(runtimeResult.getError()).toEqual(null);
    });
  });

  describe('failure tests', () => {
    it('should return an error instance and null value when using getter, after calling failure', () => {
      const posStart = new PositionTracker(4, 1, 5);
      const posEnd = new PositionTracker(5, 1, 6);
      const context = new Context('<pseudo>');
      const runtimeError = new RuntimeError('Division by zero', posStart, posEnd, context);
      const runtimeResult = new RuntimeResult();

      const returnedRuntimeResult: RuntimeResult = runtimeResult.failure(runtimeError);

      expect(returnedRuntimeResult).toEqual(runtimeResult);
      expect(runtimeResult.getValue()).toEqual(null);
      expect(runtimeResult.getError()).toEqual(runtimeError);
    });
  });

  describe('register tests', () => {
    it('should return value in runtime result if runtime result has no errors', () => {
      const number = new NumberType(10);
      const runtimeResult = new RuntimeResult();
      const otherRuntimeResult = new RuntimeResult();

      otherRuntimeResult.success(number);
      const returnedValue: ValueType = runtimeResult.register(otherRuntimeResult);

      expect(returnedValue).toEqual(number);
      expect(runtimeResult.getValue()).toEqual(null);
      expect(runtimeResult.getError()).toEqual(null);
    });

    it('should return value in runtime result if runtime result has errors and assign the error attribute', () => {
      const posStart = new PositionTracker(4, 1, 5);
      const posEnd = new PositionTracker(5, 1, 6);
      const context = new Context('<pseudo>');
      const runtimeError = new RuntimeError('Division by zero', posStart, posEnd, context);
      const runtimeResult = new RuntimeResult();
      const otherRuntimeResult = new RuntimeResult();

      otherRuntimeResult.failure(runtimeError);
      const returnedValue: ValueType = runtimeResult.register(otherRuntimeResult);

      expect(returnedValue).toEqual(null);
      expect(runtimeResult.getValue()).toEqual(null);
      expect(runtimeResult.getError()).toEqual(runtimeError);
    });
  });
});
