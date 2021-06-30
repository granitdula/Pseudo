import { Context } from './../logic/context';
import { RuntimeError } from './../logic/runtime-error';
import { PositionTracker } from './../logic/position-tracker';
import { ValueType } from './value-type';

/**
 * Used to represent both numbers and boolean primitives in Pseudo.
 */
export class NumberType extends ValueType {

  constructor(private value: number) {
    super();
  }

  public addBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      return [new NumberType(this.value + other.getValue()).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public subtractBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      return [new NumberType(this.value - other.getValue()).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public multiplyBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      return [new NumberType(this.value * other.getValue()).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public divideBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      if (other.getValue() === 0) {
        return [null, new RuntimeError('Division by zero', other.getPosStart(),
                                        other.getPosEnd(), other.getContext())];
      }

      return [new NumberType(this.value / other.getValue()).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public poweredBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      return [new NumberType(this.value ** other.getValue()).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public equalityComparison(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value === other.getValue() ? 1 : 0;
      return [new NumberType(convertedBoolToNum).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public lessThanComparison(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value < other.getValue() ? 1 : 0;
      return [new NumberType(convertedBoolToNum).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public greaterThanComparison(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value > other.getValue() ? 1 : 0;
      return [new NumberType(convertedBoolToNum).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public lessThanOrEqualComparison(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value <= other.getValue() ? 1 : 0;
      return [new NumberType(convertedBoolToNum).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public greaterThanOrEqualComparison(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value >= other.getValue() ? 1 : 0;
      return [new NumberType(convertedBoolToNum).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public andBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedValue: number = this.value !== 0 ? 1 : 0;
      const convertedOther: number = other.getValue() !== 0 ? 1 : 0;
      const convertedBoolToNum: number = convertedValue && convertedOther;
      return [new NumberType(convertedBoolToNum).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public orBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedValue: number = this.value !== 0 ? 1 : 0;
      const convertedOther: number = other.getValue() !== 0 ? 1 : 0;
      const convertedBoolToNum: number = convertedValue || convertedOther;
      return [new NumberType(convertedBoolToNum).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public notted(): [ValueType, RuntimeError] {
    const convertedValueToBool: number = this.value === 0 ? 1 : 0;
    return [new NumberType(convertedValueToBool).setContext(this.context), null];
  }

  public isTrue(): boolean { return this.value !== 0; }

  public copy(): NumberType {
    const number = new NumberType(this.value);

    number.setPos(this.posStart, this.posEnd);
    number.setContext(this.context);

    return number;
  }

  public getValue(): number { return this.value; }
}
