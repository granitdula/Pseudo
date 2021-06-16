import { Context } from './../logic/context';
import { RuntimeError } from './../logic/runtime-error';
import { PositionTracker } from './../logic/position-tracker';

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

  public getValue(): number { return this.value; }

  public getPosStart(): PositionTracker { return this.posStart; }

  public getPosEnd(): PositionTracker { return this.posEnd; }

  public getContext(): Context { return this.context; }
}
