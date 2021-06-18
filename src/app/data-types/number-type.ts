import { Context } from './../logic/context';
import { RuntimeError } from './../logic/runtime-error';
import { PositionTracker } from './../logic/position-tracker';

/**
 * Used to represent both numbers and boolean primitives in Pseudo.
 */
export class NumberType {

  private posStart: PositionTracker;
  private posEnd: PositionTracker;
  private context;

  constructor(private value: number) {
    this.setPos(null, null);
    this.setContext(null);
  }

  public setPos(start: PositionTracker, end: PositionTracker): NumberType {
    this.posStart = start;
    this.posEnd = end;

    return this;
  }

  public setContext(context: Context): NumberType {
    this.context = context;
    return this;
  }

  public addBy(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      return new NumberType(this.value + other.getValue()).setContext(this.context);
    }
  }

  public subtractBy(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      return new NumberType(this.value - other.getValue()).setContext(this.context);
    }
  }

  public multiplyBy(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      return new NumberType(this.value * other.getValue()).setContext(this.context);
    }
  }

  public divideBy(other: NumberType): [NumberType, RuntimeError] {
    if (other instanceof NumberType) {
      if (other.getValue() === 0) {
        return [null, new RuntimeError('Division by zero', other.getPosStart(),
                                        other.getPosEnd(), other.getContext())];
      }

      return [new NumberType(this.value / other.getValue()).setContext(this.context), null];
    }
  }

  public poweredBy(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      return new NumberType(this.value ** other.getValue()).setContext(this.context);
    }
  }

  public equalityComparison(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value === other.getValue() ? 1 : 0;
      return new NumberType(convertedBoolToNum).setContext(this.context);
    }
  }

  public lessThanComparison(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value < other.getValue() ? 1 : 0;
      return new NumberType(convertedBoolToNum).setContext(this.context);
    }
  }

  public greaterThanComparison(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value > other.getValue() ? 1 : 0;
      return new NumberType(convertedBoolToNum).setContext(this.context);
    }
  }

  public lessThanOrEqualComparison(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value <= other.getValue() ? 1 : 0;
      return new NumberType(convertedBoolToNum).setContext(this.context);
    }
  }

  public greaterThanOrEqualComparison(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedBoolToNum: number = this.value >= other.getValue() ? 1 : 0;
      return new NumberType(convertedBoolToNum).setContext(this.context);
    }
  }

  public andBy(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedValue: number = this.value !== 0 ? 1 : 0;
      const convertedOther: number = other.getValue() !== 0 ? 1 : 0;
      const convertedBoolToNum: number = convertedValue && convertedOther;
      return new NumberType(convertedBoolToNum).setContext(this.context);
    }
  }

  public orBy(other: NumberType): NumberType {
    if (other instanceof NumberType) {
      // This expression is most performant way to convert from boolean to number in Javascript.
      const convertedValue: number = this.value !== 0 ? 1 : 0;
      const convertedOther: number = other.getValue() !== 0 ? 1 : 0;
      const convertedBoolToNum: number = convertedValue || convertedOther;
      return new NumberType(convertedBoolToNum).setContext(this.context);
    }
  }

  public notted(): NumberType {
    const convertedValueToBool: number = this.value === 0 ? 1 : 0;
    return new NumberType(convertedValueToBool).setContext(this.context);
  }

  public copy(): NumberType {
    const number = new NumberType(this.value);

    number.setPos(this.posStart, this.posEnd);
    number.setContext(this.context);

    return number;
  }

  public getValue(): number { return this.value; }

  public getPosStart(): PositionTracker { return this.posStart; }

  public getPosEnd(): PositionTracker { return this.posEnd; }

  public getContext(): Context { return this.context; }
}
