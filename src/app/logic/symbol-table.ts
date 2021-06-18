import { NumberType } from './../data-types/number-type';

export class SymbolTable {

  private symbols: Map<string, NumberType> = new Map<string, NumberType>();
  private parent: SymbolTable = null;

  public get(variableName: string): NumberType {
    const value: NumberType = this.symbols.get(variableName);
    if (value === undefined && this.parent !== null) { return this.parent.get(variableName); }

    return value;
  }

  public set(variableName: string, value: NumberType): void {
    this.symbols.set(variableName, value);
  }

  public remove(variableName: string): void { this.symbols.delete(variableName); }

  public getSymbols(): Map<string, NumberType> { return this.symbols }

  public getParent(): SymbolTable { return this.parent }
}
