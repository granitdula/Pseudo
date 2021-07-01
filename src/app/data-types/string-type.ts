import { NumberType } from './number-type';
import { RuntimeError } from './../logic/runtime-error';
import { ValueType } from './value-type';

export class StringType extends ValueType {

  constructor(private value: string) {
    super();
  }

  public addBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof StringType) {
      return [new StringType(this.value + other.getValue()).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public multiplyBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      if (other.getValue() < 0) {
        return [null, new RuntimeError('Multiplied string by negative value', other.getPosStart(),
                                        other.getPosEnd(), other.getContext())];
      }
      return [new StringType(this.value.repeat(other.getValue())).setContext(this.context), null];
    }
    else { return [null, this.illegalOperation()]; }
  }

  public isTrue(): boolean { return this.value.length > 0; }

  public copy(): StringType {
    const str = new StringType(this.value);

    str.setPos(this.posStart, this.posEnd);
    str.setContext(this.context);

    return str;
  }

  public getValue(): string { return this.value; }
}
