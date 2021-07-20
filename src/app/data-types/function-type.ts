import { RuntimeError } from './../logic/runtime-error';
import { SymbolTable } from './../logic/symbol-table';
import { Context } from './../logic/context';
import { InterpreterService } from './../services/interpreter.service';
import { RuntimeResult } from './../logic/runtime-result';
import { ASTNode } from './../models/ast-node';
import { ValueType } from './value-type';

export class FunctionType extends ValueType {
  private name: string;

  constructor(private bodyNode: ASTNode, private argNames: string[], name?: string) {
    super();
    this.name = name === undefined ? '<anonymous>' : name;
  }

  public execute(args: ValueType[], interpreter: InterpreterService): RuntimeResult {
    let runtimeResult = new RuntimeResult();
    let newContext = new Context(this.name, this.context, this.posStart);

    newContext.symbolTable = new SymbolTable(newContext.getParent().symbolTable);

    runtimeResult = this.checkArgLengths(args);
    if (runtimeResult.shouldReturn()) { return runtimeResult; }

    for (let i = 0; i < args.length; i++) {
      const argName: string = this.argNames[i];
      const argValue: ValueType = args[i];

      argValue.setContext(newContext); // Set the scope of the argument within the function.
      newContext.symbolTable.set(argName, argValue);
    }

    runtimeResult.register(interpreter.visitNode(this.bodyNode, newContext));
    if (runtimeResult.shouldReturn() && runtimeResult.getFuncReturnValue() === null) {
      return runtimeResult;
    }

    const returnValue = runtimeResult.getFuncReturnValue() !== null ?
                        runtimeResult.getFuncReturnValue() : null;

    return runtimeResult.success(returnValue);
  }

  public copy(): FunctionType {
    const copy = new FunctionType(this.bodyNode, this.argNames, this.name);
    copy.setPos(this.posStart, this.posEnd);
    copy.setContext(this.context);

    return copy;
  }

  public getName(): string { return this.name; }

  private checkArgLengths(args: ValueType[]): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    if (args.length !== this.argNames.length) {
      const runtimeError = new RuntimeError(`${args.length} arguments were passed into ` +
                                            `${this.name}. Expected ${this.argNames.length}`,
                                            this.posStart, this.posEnd, this.context);
      return runtimeResult.failure(runtimeError);
    }

    return runtimeResult;
  }
}
