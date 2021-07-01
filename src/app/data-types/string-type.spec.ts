import { NumberType } from './number-type';
import { StringType } from './string-type';
import { PositionTracker } from '../logic/position-tracker';
import { Context } from '../logic/context';
import { ValueType } from './value-type';
import { RuntimeError } from '../logic/runtime-error';

describe('StringType tests', () => {
  it('should initialise with passed value but with null position tracker and context', () => {
    const str = new StringType('hello world');

    expect(str.getValue()).toEqual('hello world');
    expect(str.getPosStart()).toEqual(null);
    expect(str.getPosEnd()).toEqual(null);
    expect(str.getContext()).toEqual(null);
  });

  describe('setter tests', () => {
    it('should set posStart and posEnd when calling setPos', () => {
      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const str = new StringType('some string');

      str.setPos(posStart, posEnd);

      expect(str.getValue()).toEqual('some string');
      expect(str.getPosStart()).toEqual(posStart);
      expect(str.getPosEnd()).toEqual(posEnd);
      expect(str.getContext()).toEqual(null);
    });

    it('should set context when calling setContext', () => {
      const context = new Context('<pseudo>');
      const str = new StringType('random string');

      str.setContext(context);

      expect(str.getValue()).toEqual('random string');
      expect(str.getPosStart()).toEqual(null);
      expect(str.getPosEnd()).toEqual(null);
      expect(str.getContext()).toEqual(context);
    });
  });

  describe('copy tests', () => {
    it('should create a new copied instance of the NumberType when calling copy', () => {
      const str = new StringType('some string');
      const copiedString = str.copy();

      expect(str).toEqual(copiedString);

      const startPos = new PositionTracker(0, 1, 1);
      const endPos = new PositionTracker(1, 1, 2);
      copiedString.setPos(startPos, endPos);

      expect(str.getPosStart()).toEqual(null);
      expect(str.getPosEnd()).toEqual(null);
      expect(copiedString.getPosStart()).toEqual(startPos);
      expect(copiedString.getPosEnd()).toEqual(endPos);
    });
  });

  describe('addBy tests', () => {
    it('should return StringType with concatenated value and common context', () => {
      const context = new Context('<pseudo>');
      const str = new StringType('hello ');
      const otherString = new StringType('world!');

      str.setContext(context);
      const [newString, error]: [ValueType, RuntimeError] = str.addBy(otherString);

      if (newString instanceof StringType) {
        expect(newString.getValue()).toEqual('hello world!');
      }
      else { fail('newString is not an instance of NumberType'); }

      expect(newString.getPosStart()).toEqual(null);
      expect(newString.getPosEnd()).toEqual(null);
      expect(newString.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('multiplyBy tests', () => {
    it('should return StringType with multiplied number of text for the string and common context', () => {
      const context = new Context('<pseudo>');
      const str = new StringType('hello! ');
      const number = new NumberType(3);

      str.setContext(context);
      const [newString, error]: [ValueType, RuntimeError] = str.multiplyBy(number);

      if (newString instanceof StringType) {
        expect(newString.getValue()).toEqual('hello! hello! hello! ');
      }
      else { fail('newString is not an instance of NumberType'); }

      expect(newString.getPosStart()).toEqual(null);
      expect(newString.getPosEnd()).toEqual(null);
      expect(newString.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return StringType with empty string when multiplied by 0 and common context', () => {
      const context = new Context('<pseudo>');
      const str = new StringType('hello! ');
      const number = new NumberType(0);

      str.setContext(context);
      const [newString, error]: [ValueType, RuntimeError] = str.multiplyBy(number);

      if (newString instanceof StringType) {
        expect(newString.getValue()).toEqual('');
      }
      else { fail('newString is not an instance of NumberType'); }

      expect(newString.getPosStart()).toEqual(null);
      expect(newString.getPosEnd()).toEqual(null);
      expect(newString.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('isTrue tests', () => {
    it('should return NumberType with value of 1 for strings of length greater than 0', () => {
      const context = new Context('<pseudo>');
      const str = new StringType('hello');

      str.setContext(context);
      const result: boolean = str.isTrue();

      expect(result).toEqual(true);
    });

    it('should return NumberType with value of 0 for strings of length 0', () => {
      const context = new Context('<pseudo>');
      const str = new StringType('');

      str.setContext(context);
      const result: boolean = str.isTrue();

      expect(result).toEqual(false);
    });
  });
});
