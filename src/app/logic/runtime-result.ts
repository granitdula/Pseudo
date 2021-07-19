import { RuntimeError } from './runtime-error';
import { ValueType } from '../data-types/value-type';

export class RuntimeResult {
  private value: ValueType;
  private error: RuntimeError;
  private funcReturnValue: ValueType;

  constructor() { this.reset(); }

  private reset(): void {
    this.value = null;
    this.error = null;
    this.funcReturnValue = null;
  }

  public register(result: RuntimeResult): ValueType {
    this.error = result.getError();
    this.funcReturnValue = result.getFuncReturnValue();
    return result.value;
  }

  public success(value: ValueType): RuntimeResult {
    this.reset();
    this.value = value;
    return this;
  }

  public returnSuccess(value: ValueType): RuntimeResult {
    this.reset();
    this.funcReturnValue = value;
    return this;
  }

  public failure(error: RuntimeError): RuntimeResult {
    this.reset();
    this.error = error;
    return this;
  }

  public shouldReturn(): boolean {
    return this.error !== null || this.funcReturnValue !== null;
  }

  public getValue(): ValueType { return this.value; }

  public getFuncReturnValue(): ValueType { return this.funcReturnValue; }

  public getError(): RuntimeError { return this.error; }
}
