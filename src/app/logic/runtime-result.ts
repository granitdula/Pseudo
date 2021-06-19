import { RuntimeError } from './runtime-error';
import { NumberType } from './../data-types/number-type';

export class RuntimeResult {
  private value: NumberType = null;
  private error: RuntimeError = null;

  public register(result: RuntimeResult): NumberType {
    if (result.getError() !== null) { this.error = result.getError(); }
    return result.value;
  }

  public success(value: NumberType): RuntimeResult {
    this.value = value;
    return this;
  }

  public failure(error: RuntimeError): RuntimeResult {
    this.error = error;
    return this;
  }

  public getValue(): NumberType { return this.value; }

  public getError(): RuntimeError { return this.error; }
}
