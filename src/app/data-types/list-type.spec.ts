import { NumberType } from './number-type';
import { ListType } from "./list-type";
import { PositionTracker } from '../logic/position-tracker';
import { Context } from '../logic/context';
import { ValueType } from './value-type';
import { RuntimeError } from '../logic/runtime-error';
import { StringType } from './string-type';

describe('ListType tests', () => {
  it('should initialise with with passed value but with null position tracker and context', () => {
    const list = new ListType([]);

    expect(list.elements).toEqual([]);
    expect(list.getPosStart()).toEqual(null);
    expect(list.getPosEnd()).toEqual(null);
    expect(list.getContext()).toEqual(null);
  });

  describe('setter tests', () => {
    it('should set posStart and posEnd when calling setPos', () => {
      const posStart = new PositionTracker(0, 1, 1);
      const posEnd = new PositionTracker(1, 1, 2);
      const list = new ListType([]);

      list.setPos(posStart, posEnd);

      expect(list.elements).toEqual([]);
      expect(list.getPosStart()).toEqual(posStart);
      expect(list.getPosEnd()).toEqual(posEnd);
      expect(list.getContext()).toEqual(null);
    });

    it('should set context when calling setContext', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([]);

      list.setContext(context);

      expect(list.elements).toEqual([]);
      expect(list.getPosStart()).toEqual(null);
      expect(list.getPosEnd()).toEqual(null);
      expect(list.getContext()).toEqual(context);
    });
  });

  describe('copy tests', () => {
    it('should create a new copied instance of the NumberType when calling copy', () => {
      const list = new ListType([]);
      const copiedList = list.copy();

      expect(list).toEqual(copiedList);

      const startPos = new PositionTracker(0, 1, 1);
      const endPos = new PositionTracker(1, 1, 2);
      copiedList.setPos(startPos, endPos);

      expect(list.getPosStart()).toEqual(null);
      expect(list.getPosEnd()).toEqual(null);
      expect(copiedList.getPosStart()).toEqual(startPos);
      expect(copiedList.getPosEnd()).toEqual(endPos);
    });
  });

  describe('addBy tests', () => {
    it('should return ListType with appended value and common context', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2)]);
      const otherNumber = new NumberType(3);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.addBy(otherNumber);
      const expectedList: ValueType[] = [new NumberType(1), new NumberType(2), new NumberType(3)];
      if (newList instanceof ListType) { expect(newList.elements).toEqual(expectedList); }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });
  });

  describe('subtractBy tests', () => {
    it('should return ListType with removed value at specified index and common context', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2)]);
      const otherNumber = new NumberType(0);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.subtractBy(otherNumber);
      const expectedList: ValueType[] = [new NumberType(2)];
      if (newList instanceof ListType) { expect(newList.elements).toEqual(expectedList); }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return ListType with removed value at specified negative index and common context', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2)]);
      const otherNumber = new NumberType(-1);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.subtractBy(otherNumber);
      const expectedList: ValueType[] = [new NumberType(1)];
      if (newList instanceof ListType) { expect(newList.elements).toEqual(expectedList); }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return runtime error when passing a StringType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0)]);
      const otherString = new StringType('hello');

      list.setContext(context);
      const [newList, error]: [ValueType, RuntimeError] = list.subtractBy(otherString);

      const expectedRuntimeErr = new RuntimeError('Illegal operation', list.getPosStart(),
                                                                      list.getPosEnd(),
                                                                      list.getContext());

      expect(newList).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error when passing a decimal NumberType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(5), new NumberType(10)]);
      const otherNumber = new NumberType(1.1);

      list.setContext(context);
      const [newList, error]: [ValueType, RuntimeError] = list.subtractBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('right operand should be an integer',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newList).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error when passing a number greater than the bounds of the list', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(5), new NumberType(10)]);
      const otherNumber = new NumberType(2);

      list.setContext(context);
      const [newList, error]: [ValueType, RuntimeError] = list.subtractBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('index out of bounds',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newList).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error when passing a number less than the bounds of the list', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(5), new NumberType(10)]);
      const otherNumber = new NumberType(-3);

      list.setContext(context);
      const [newList, error]: [ValueType, RuntimeError] = list.subtractBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('index out of bounds',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newList).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error when passing an index for an empty list', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([]);
      const otherNumber = new NumberType(0);

      list.setContext(context);
      const [newList, error]: [ValueType, RuntimeError] = list.subtractBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('index out of bounds',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newList).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });
  });

  describe('multiplyBy tests', () => {
    it('should return the concatenation of the two ListTypes where one is an empty list', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2)]);
      const otherList = new ListType([]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.multiplyBy(otherList);
      const expectedList: ValueType[] = [new NumberType(1), new NumberType(2)];
      if (newList instanceof ListType) { expect(newList.elements).toEqual(expectedList); }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return the concatenation of the two ListTypes', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2)]);
      const otherList = new ListType([new NumberType(3), new NumberType(4)]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.multiplyBy(otherList);
      const expectedList: ValueType[] = [new NumberType(1), new NumberType(2), new NumberType(3),
                                         new NumberType(4)];
      if (newList instanceof ListType) { expect(newList.elements).toEqual(expectedList); }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return runtime error if right operand is not a ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherNumber = new NumberType(0);

      list.setContext(context);
      const [newList, error]: [ValueType, RuntimeError] = list.multiplyBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('Illegal operation', list.getPosStart(),
                                                   list.getPosEnd(), list.getContext());

      expect(newList).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });
  });

  describe('poweredBy tests', () => {
    it('should return the NumberType of the indexed ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2)]);
      const otherNumber = new NumberType(0);

      list.setContext(context);

      const [newElement, error]: [ValueType, RuntimeError] = list.poweredBy(otherNumber);
      const expectedNumber: number = 1;
      if (newElement instanceof NumberType) {
        expect(newElement.getValue()).toEqual(expectedNumber);
      }
      else { fail('newElement is not an instance of NumberType'); }

      expect(newElement.getPosStart()).toEqual(null);
      expect(newElement.getPosEnd()).toEqual(null);
      // Because list init with numbers without context
      expect(newElement.getContext()).toEqual(null);
      expect(error).toEqual(null);
    });

    it('should return the NumberType of the indexed ListType with negative value indexing', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2), new NumberType(3)]);
      const otherNumber = new NumberType(-1);

      list.setContext(context);

      const [newElement, error]: [ValueType, RuntimeError] = list.poweredBy(otherNumber);
      const expectedNumber: number = 3;

      if (newElement instanceof NumberType) {
        expect(newElement.getValue()).toEqual(expectedNumber);
      }
      else { fail('newElement is not an instance of NumberType'); }

      expect(newElement.getPosStart()).toEqual(null);
      expect(newElement.getPosEnd()).toEqual(null);
      // Because list init with numbers without context
      expect(newElement.getContext()).toEqual(null);
      expect(error).toEqual(null);
    });

    it('should return runtime error if right operand is not a NumberType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherString = new StringType('string');

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.poweredBy(otherString);

      const expectedRuntimeErr = new RuntimeError('Illegal operation', list.getPosStart(),
                                                   list.getPosEnd(), list.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if right operand is a decimal value', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherNumber = new NumberType(1.5);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.poweredBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('right operand should be an integer',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if index greater than bounds of list', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherNumber = new NumberType(3);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.poweredBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('index out of bounds',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if index less than bounds of list', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherNumber = new NumberType(-3);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.poweredBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('index out of bounds',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if indexing an empty list', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([]);
      const otherNumber = new NumberType(0);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.poweredBy(otherNumber);

      const expectedRuntimeErr = new RuntimeError('index out of bounds',
                                                  otherNumber.getPosStart(),
                                                  otherNumber.getPosEnd(),
                                                  otherNumber.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });
  });

  describe('lessThanComparison tests', () => {
    it('should return a ListType with inserted number element at specified index in second ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2), new NumberType(3)]);
      const otherList = new ListType([new NumberType(1), new NumberType(1.5)]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);
      const expectedList: ValueType[] = [new NumberType(1), new NumberType(1.5),
                                         new NumberType(2), new NumberType(3)];

      if (newList instanceof ListType) {
        expect(newList.elements).toEqual(expectedList);
      }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return a ListType with inserted string element at specified index in second ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2), new NumberType(3)]);
      const otherList = new ListType([new NumberType(1), new StringType('string')]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);
      const expectedList: ValueType[] = [new NumberType(1), new StringType('string'),
                                         new NumberType(2), new NumberType(3)];

      if (newList instanceof ListType) {
        expect(newList.elements).toEqual(expectedList);
      }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return a ListType with inserted element at greatest index in second ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2), new NumberType(3)]);
      const otherList = new ListType([new NumberType(3), new NumberType(4)]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);
      const expectedList: ValueType[] = [new NumberType(1), new NumberType(2),
                                         new NumberType(3), new NumberType(4)];

      if (newList instanceof ListType) {
        expect(newList.elements).toEqual(expectedList);
      }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return a ListType with inserted element at negative index in second ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2), new NumberType(3)]);
      const otherList = new ListType([new NumberType(-1), new NumberType(4)]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);
      const expectedList: ValueType[] = [new NumberType(1), new NumberType(2),
                                         new NumberType(4), new NumberType(3)];

      if (newList instanceof ListType) {
        expect(newList.elements).toEqual(expectedList);
      }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return a ListType with inserted element at lowest index in second ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2), new NumberType(3)]);
      const otherList = new ListType([new NumberType(0), new NumberType(0)]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);
      const expectedList: ValueType[] = [new NumberType(0), new NumberType(1),
                                         new NumberType(2), new NumberType(3)];

      if (newList instanceof ListType) {
        expect(newList.elements).toEqual(expectedList);
      }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return a ListType with inserted element at lowest index using negative index in second ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(1), new NumberType(2), new NumberType(3)]);
      const otherList = new ListType([new NumberType(-3), new NumberType(0)]);

      list.setContext(context);

      const [newList, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);
      const expectedList: ValueType[] = [new NumberType(0), new NumberType(1),
                                         new NumberType(2), new NumberType(3)];

      if (newList instanceof ListType) {
        expect(newList.elements).toEqual(expectedList);
      }
      else { fail('newList is not an instance of ListType'); }

      expect(newList.getPosStart()).toEqual(null);
      expect(newList.getPosEnd()).toEqual(null);
      expect(newList.getContext()).toEqual(context);
      expect(error).toEqual(null);
    });

    it('should return runtime error if right operand is not a ListType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherString = new StringType('string');

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherString);

      const expectedRuntimeErr = new RuntimeError('Illegal operation', list.getPosStart(),
                                                   list.getPosEnd(), list.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if right operand is a ListType of size 3', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherList = new ListType([new NumberType(0), new NumberType(0), new NumberType(0)]);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);

      const expectedRuntimeErr = new RuntimeError('list on the right should be of size 2 where' +
                                                  ' index 0 is the position and 1 is the element',
                                                  otherList.getPosStart(), otherList.getPosEnd(),
                                                  otherList.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if right operand is a ListType of size 0', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherList = new ListType([]);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);

      const expectedRuntimeErr = new RuntimeError('list on the right should be of size 2 where' +
                                                  ' index 0 is the position and 1 is the element',
                                                  otherList.getPosStart(), otherList.getPosEnd(),
                                                  otherList.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if right operand is a ListType where first element is not NumberType', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherList = new ListType([new StringType('string'), new NumberType(0)]);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);

      const expectedRuntimeErr = new RuntimeError('element at index 0 of list on the right' +
                                                  ' should be an integer',
                                                  otherList.getPosStart(), otherList.getPosEnd(),
                                                  otherList.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if right operand is a ListType where first element is a decimal', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherList = new ListType([new NumberType(1.1), new NumberType(0)]);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);

      const expectedRuntimeErr = new RuntimeError('element at index 0 of list on the right' +
                                                  ' should be an integer',
                                                  otherList.getPosStart(), otherList.getPosEnd(),
                                                  otherList.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if right operand is a ListType where first element is greater than bounds', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherList = new ListType([new NumberType(3), new NumberType(0)]);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);

      const expectedRuntimeErr = new RuntimeError('index out of bounds', otherList.getPosStart(),
                                                  otherList.getPosEnd(), otherList.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });

    it('should return runtime error if right operand is a ListType where first element is less than bounds', () => {
      const context = new Context('<pseudo>');
      const list = new ListType([new NumberType(0), new NumberType(0)]);
      const otherList = new ListType([new NumberType(-3), new NumberType(0)]);

      list.setContext(context);
      const [newElement, error]: [ValueType, RuntimeError] = list.lessThanComparison(otherList);

      const expectedRuntimeErr = new RuntimeError('index out of bounds', otherList.getPosStart(),
                                                  otherList.getPosEnd(), otherList.getContext());

      expect(newElement).toEqual(null);
      expect(error).toEqual(expectedRuntimeErr);
    });
  });
});
