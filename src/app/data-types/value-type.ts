import { RuntimeResult } from './../logic/runtime-result';
import { RuntimeError } from './../logic/runtime-error';
import { PositionTracker } from '../logic/position-tracker';
import { Context } from '../logic/context';

export class ValueType {
  protected posStart: PositionTracker;
  protected posEnd: PositionTracker;
  protected context;

  constructor() {
    this.setPos(null, null);
    this.setContext(null);
  }

  public setPos(start: PositionTracker, end: PositionTracker): ValueType {
    this.posStart = start;
    this.posEnd = end;

    return this;
  }

  public setContext(context: Context): ValueType {
    this.context = context;
    return this;
  }

  public addBy(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public subtractBy(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public multiplyBy(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public divideBy(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public poweredBy(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public equalityComparison(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public lessThanComparison(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public greaterThanComparison(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public lessThanOrEqualComparison(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public greaterThanOrEqualComparison(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public andBy(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public orBy(other: ValueType): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public notted(): [ValueType, RuntimeError] {
    return [null, this.illegalOperation()];
  }

  public execute(...args: any[]): RuntimeResult {
    const runtimeResult = new RuntimeResult();
    return runtimeResult.failure(this.illegalOperation());
  }

  public isTrue(): boolean { return false; }

  public copy() {
    throw new ErrorEvent('No copy method defined');
  }

  public getPosStart(): PositionTracker { return this.posStart; }

  public getPosEnd(): PositionTracker { return this.posEnd; }

  public getContext(): Context { return this.context; }

  protected illegalOperation(): RuntimeError {
    const runtimeError = new RuntimeError('Illegal operation', this.posStart, this.posEnd,
                                          this.context);
    return runtimeError;
  }
}
