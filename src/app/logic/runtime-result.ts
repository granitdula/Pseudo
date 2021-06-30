import { RuntimeError } from './runtime-error';
import { ValueType } from '../data-types/value-type';

export class RuntimeResult {
  private value: ValueType = null;
  private error: RuntimeError = null;

  public register(result: RuntimeResult): ValueType {
    if (result.getError() !== null) { this.error = result.getError(); }
    return result.value;
  }

  public success(value: ValueType): RuntimeResult {
    this.value = value;
    return this;
  }

  public failure(error: RuntimeError): RuntimeResult {
    this.error = error;
    return this;
  }

  public getValue(): ValueType { return this.value; }

  public getError(): RuntimeError { return this.error; }
}
