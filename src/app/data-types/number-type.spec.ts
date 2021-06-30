import { RuntimeError } from './../logic/runtime-error';
import { PositionTracker } from './../logic/position-tracker';
import { NumberType } from './number-type';
import { Context } from '../logic/context';
import { ValueType } from './value-type';

describe('Number tests', () => {
  it('should initialise with with passed value but with null position tracker and context', () => {
    const number = new NumberType(10);

    expect(number.getValue()).toEqual(10);
    expect(number.getPosStart()).toEqual(null);
    expect(number.getPosEnd()).toEqual(null);
    expect(number.getContext()).toEqual(null);
  });

  describe('setter tests', () => {
    it('should set posStart and posEnd when calling setPos', () => {
      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const number = new NumberType(10);

      number.setPos(posStart, posEnd);

      expect(number.getValue()).toEqual(10);
      expect(number.getPosStart()).toEqual(posStart);
      expect(number.getPosEnd()).toEqual(posEnd);
      expect(number.getContext()).toEqual(null);
    });

    it('should set context when calling setContext', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);

      number.setContext(context);

      expect(number.getValue()).toEqual(10);
      expect(number.getPosStart()).toEqual(null);
      expect(number.getPosEnd()).toEqual(null);
      expect(number.getContext()).toEqual(context);
    });
  });

  describe('copy tests', () => {
    it('should create a new copied instance of the NumberType when calling copy', () => {
      const number = new NumberType(10);
      const copiedNumber = number.copy();

      expect(number).toEqual(copiedNumber);

      const startPos = new PositionTracker(0, 1, 1);
      const endPos = new PositionTracker(1, 1, 2);
      copiedNumber.setPos(startPos, endPos);

      expect(number.getPosStart()).toEqual(null);
      expect(number.getPosEnd()).toEqual(null);
      expect(copiedNumber.getPosStart()).toEqual(startPos);
      expect(copiedNumber.getPosEnd()).toEqual(endPos);
    });
  });

  describe('addBy tests', () => {
    it('should return NumberType with added value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.addBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(15); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('subtractBy tests', () => {
    it('should return NumberType with subtracted value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.subtractBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(5); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('multiplyBy tests', () => {
    it('should return NumberType with multiplied value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.multiplyBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(50); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('divideBy tests', () => {
    it('should return NumberType with divided value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.divideBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(2); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return runtime error when passing a NumberType with value 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(0);
      const expectedRuntimeErr = new RuntimeError('Division by zero', otherNumber.getPosStart(),
                                                                        otherNumber.getPosEnd(),
                                                                      otherNumber.getContext());

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.divideBy(otherNumber);

      expect(newNumber).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });
  });

  describe('poweredBy tests', () => {
    it('should return NumberType with powered value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.poweredBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(100000); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('equalityComparison tests', () => {
    it('should return NumberType with a value of 1 when values are equal', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(10);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.equalityComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when values are not equal', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(11);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.equalityComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('lessThanComparison tests', () => {
    it('should return NumberType with a value of 1 when number is less than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(2);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.lessThanComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is equal to otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.lessThanComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is greater than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(2);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.lessThanComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('greaterThanComparison tests', () => {
    it('should return NumberType with a value of 1 when number is greater than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(2);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.greaterThanComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is equal to otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.greaterThanComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is less than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(2);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.greaterThanComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('lessThanOrEqualComparison tests', () => {
    it('should return NumberType with a value of 1 when number is less than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(2);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.lessThanOrEqualComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is equal to otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.lessThanOrEqualComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is greater than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(2);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.lessThanOrEqualComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('greaterThanOrEqualComparison tests', () => {
    it('should return NumberType with a value of 1 when number is greater than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(2);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.greaterThanOrEqualComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is equal to otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.greaterThanOrEqualComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is less than otherNumber', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(2);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.greaterThanOrEqualComparison(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('andBy tests', () => {
    it('should return NumberType with a value of 0 when number is 0 and otherNumber is 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(0);
      const otherNumber = new NumberType(0);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.andBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is 1 and otherNumber is 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(0);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.andBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 0 when number is 0 and otherNumber is 1', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(0);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.andBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is 1 and otherNumber is 1', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.andBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is 100 and otherNumber is 10 (treated as 1s)', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(100);
      const otherNumber = new NumberType(10);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.andBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('orBy tests', () => {
    it('should return NumberType with a value of 0 when number is 0 and otherNumber is 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(0);
      const otherNumber = new NumberType(0);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.orBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is 1 and otherNumber is 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(0);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.orBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is 0 and otherNumber is 1', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(0);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.orBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is 1 and otherNumber is 1', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const otherNumber = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.orBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with a value of 1 when number is 100 and otherNumber is 10 (treated as 1s)', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(100);
      const otherNumber = new NumberType(10);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.orBy(otherNumber);

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('notted tests', () => {
    it('should return NumberType with value of 0 when number is 1', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.notted();

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with value of 1 when number is 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(0);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.notted();

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(1); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return NumberType with value of 0 when number is 100 (treated as 1)', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(100);

      number.setContext(context);
      const [newNumber, error]: [ValueType, RuntimeError] = number.notted();

      if (newNumber instanceof NumberType) { expect(newNumber.getValue()).toEqual(0); }
      else { fail('newNumber is not an instance of NumberType'); }

      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('isTrue tests', () => {
    it('should return true if NumberType is not 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(1);
      const number2 = new NumberType(100);

      number.setContext(context);
      number2.setContext(context);

      expect(number.getValue()).toEqual(1);
      expect(number.getPosStart()).toEqual(null);
      expect(number.getPosEnd()).toEqual(null);
      expect(number.getContext()).toEqual(context);
      expect(number.isTrue()).toEqual(true);

      expect(number2.getValue()).toEqual(100);
      expect(number2.getPosStart()).toEqual(null);
      expect(number2.getPosEnd()).toEqual(null);
      expect(number2.getContext()).toEqual(context);
      expect(number2.isTrue()).toEqual(true);
    });

    it('should return false if NumberType is 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(0);

      number.setContext(context);

      expect(number.getValue()).toEqual(0);
      expect(number.getPosStart()).toEqual(null);
      expect(number.getPosEnd()).toEqual(null);
      expect(number.getContext()).toEqual(context);
      expect(number.isTrue()).toEqual(false);
    });
  });
});
