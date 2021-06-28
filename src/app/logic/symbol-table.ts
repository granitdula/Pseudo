import { ValueType } from '../data-types/value-type';

export class SymbolTable {

  private symbols: Map<string, ValueType> = new Map<string, ValueType>();
  private parent: SymbolTable = null;

  public get(variableName: string): ValueType {
    const value: ValueType = this.symbols.get(variableName);
    if (value === undefined && this.parent !== null) { return this.parent.get(variableName); }

    return value;
  }

  public set(variableName: string, value: ValueType): void {
    this.symbols.set(variableName, value);
  }

  public remove(variableName: string): void { this.symbols.delete(variableName); }

  public getSymbols(): Map<string, ValueType> { return this.symbols }

  public getParent(): SymbolTable { return this.parent }
}
