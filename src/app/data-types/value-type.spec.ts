import { ValueType } from "./value-type";
import { PositionTracker } from '../logic/position-tracker';
import { Context } from '../logic/context';
import { RuntimeError } from '../logic/runtime-error';
import { RuntimeResult } from '../logic/runtime-result';

describe('ValueType tests', () => {
  it('should initialise ValueType with posStart, posEnd and context to null', () => {
    const valueType = new ValueType();

    expect(valueType.getPosStart()).toEqual(null);
    expect(valueType.getPosEnd()).toEqual(null);
    expect(valueType.getContext()).toEqual(null);
  });

  describe('setter tests', () => {
    it('should set posStart and posEnd when calling setPos', () => {
      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const value = new ValueType();

      value.setPos(posStart, posEnd);

      expect(value.getPosStart()).toEqual(posStart);
      expect(value.getPosEnd()).toEqual(posEnd);
      expect(value.getContext()).toEqual(null);
    });

    it('should set context when calling setContext', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();

      value.setContext(context);

      expect(value.getPosStart()).toEqual(null);
      expect(value.getPosEnd()).toEqual(null);
      expect(value.getContext()).toEqual(context);
    });
  });

  describe('addBy tests', () => {
    it('should produce a runtime error by default when calling addBy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.addBy(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('subtractBy tests', () => {
    it('should produce a runtime error by default when calling subtractBy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.subtractBy(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('multiplyBy tests', () => {
    it('should produce a runtime error by default when calling multiplyBy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.multiplyBy(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('divideBy tests', () => {
    it('should produce a runtime error by default when calling divideBy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.divideBy(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('poweredBy tests', () => {
    it('should produce a runtime error by default when calling poweredBy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.poweredBy(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('equalityComparison tests', () => {
    it('should produce a runtime error by default when calling equalityComparison', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.equalityComparison(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('lessThanComparison tests', () => {
    it('should produce a runtime error by default when calling lessThanComparison', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.lessThanComparison(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('greaterThanComparison tests', () => {
    it('should produce a runtime error by default when calling greaterThanComparison', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.greaterThanComparison(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('lessThanOrEqualComparison tests', () => {
    it('should produce a runtime error by default when calling lessThanOrEqualComparison', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.lessThanOrEqualComparison(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('greaterThanOrEqualComparison tests', () => {
    it('should produce a runtime error by default when calling greaterThanOrEqualComparison', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.greaterThanOrEqualComparison(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('andBy tests', () => {
    it('should produce a runtime error by default when calling andBy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.andBy(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('orBy tests', () => {
    it('should produce a runtime error by default when calling orBy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();
      const othervalue = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.orBy(othervalue);

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('notted tests', () => {
    it('should produce a runtime error by default when calling notted', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();

      value.setContext(context);
      const [newvalue, error]: [ValueType, RuntimeError] = value.notted();

      const expectedError = new RuntimeError('Illegal operation', null, null, context);

      expect(newvalue).toEqual(null);
      expect(error).toEqual(expectedError);
    });
  });

  describe('execute tests', () => {
    it('should return runtime result with illegal operation runtime error', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();

      value.setContext(context);

      const runtimeResult: RuntimeResult = value.execute();

      const expectedRuntimeError = new RuntimeError('Illegal operation', null, null, context);
      const expectedRuntimeResult = new RuntimeResult();
      expectedRuntimeResult.failure(expectedRuntimeError);

      expect(runtimeResult).toEqual(expectedRuntimeResult);
    });
  });

  describe('isTrue tests', () => {
    it('should return false for a ValueType when calling isTrue', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();

      value.setContext(context);

      expect(value.isTrue()).toEqual(false);
    });
  });

  describe('copy tests', () => {
    it('should throw an error event when calling copy', () => {
      const context = new Context('<pseudo>');
      const value = new ValueType();

      value.setContext(context);

      try {
        value.copy();

        fail('copy does not throw an error for ValueType');
      } catch (error) {
        expect(true).toEqual(true);
      }
    });
  });
});
