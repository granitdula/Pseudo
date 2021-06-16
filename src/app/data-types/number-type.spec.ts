import { RuntimeError } from './../logic/runtime-error';
import { PositionTracker } from './../logic/position-tracker';
import { NumberType } from './number-type';
import { Context } from '../logic/context';

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

  describe('addBy tests', () => {
    it('should return NumberType with added value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const newNumber: NumberType = number.addBy(otherNumber);

      expect(newNumber.getValue()).toEqual(15);
      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
    });
  });

  describe('subtractBy tests', () => {
    it('should return NumberType with subtracted value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const newNumber: NumberType = number.subtractBy(otherNumber);

      expect(newNumber.getValue()).toEqual(5);
      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
    });
  });

  describe('multiplyBy tests', () => {
    it('should return NumberType with multiplied value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const newNumber: NumberType = number.multiplyBy(otherNumber);

      expect(newNumber.getValue()).toEqual(50);
      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
    });
  });

  describe('divideBy tests', () => {
    it('should return NumberType with divided value and common context', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(5);

      number.setContext(context);
      const [newNumber, _]: [NumberType, RuntimeError] = number.divideBy(otherNumber);

      expect(newNumber.getValue()).toEqual(2);
      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
    });

    it('should return runtime error when passing a NumberType with value 0', () => {
      const context = new Context('<pseudo>');
      const number = new NumberType(10);
      const otherNumber = new NumberType(0);
      const expectedRuntimeErr = new RuntimeError('Division by zero', otherNumber.getPosStart(),
                                                                        otherNumber.getPosEnd(),
                                                                      otherNumber.getContext());

      number.setContext(context);
      const [newNumber, error]: [NumberType, RuntimeError] = number.divideBy(otherNumber);

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
      const newNumber: NumberType = number.poweredBy(otherNumber);

      expect(newNumber.getValue()).toEqual(100000);
      expect(newNumber.getPosStart()).toEqual(null);
      expect(newNumber.getPosEnd()).toEqual(null);
      expect(newNumber.getContext()).toEqual(context);
    });
  });
});
