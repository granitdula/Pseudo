import { ValueType } from './../data-types/value-type';
import { NumberType } from './../data-types/number-type';
import { SymbolTable } from './symbol-table';

describe('SymbolTable tests', () => {
  it('should initialise with an empty symbols map and null parent (if not passed)', () => {
    const symbolTable = new SymbolTable();
    const expectedSymbols = new Map<string, NumberType>();
    const expectedParentTable: SymbolTable = null;

    expect(symbolTable.getSymbols()).toEqual(expectedSymbols);
    expect(symbolTable.getParent()).toEqual(expectedParentTable);
  });

  it('should initialise with an empty symbols map and a parent when passed', () => {
    const parentSymbolTable = new SymbolTable();
    const symbolTable = new SymbolTable(parentSymbolTable);
    const expectedSymbols = new Map<string, NumberType>();

    expect(symbolTable.getSymbols()).toEqual(expectedSymbols);
    expect(symbolTable.getParent()).toEqual(parentSymbolTable);
  });

  describe('set and get tests', () => {
    it('should return undefined value for trying to get from an empty SymbolTable', () => {
      const symbolTable = new SymbolTable();
      const value: ValueType = symbolTable.get('variable');

      expect(value).toEqual(undefined);
    });

    it('should return correct value for getting an existing value in the SymbolTable', () => {
      const symbolTable = new SymbolTable();
      symbolTable.set('variable', new NumberType(10));
      symbolTable.set('variable2', new NumberType(20));
      symbolTable.set('variable3', new NumberType(100));

      const value1: ValueType = symbolTable.get('variable');
      const value2: ValueType = symbolTable.get('variable2');
      const value3: ValueType = symbolTable.get('variable3');
      const value4: ValueType = symbolTable.get('var');

      expect(value1).toEqual(new NumberType(10));
      expect(value2).toEqual(new NumberType(20));
      expect(value3).toEqual(new NumberType(100));
      expect(value4).toEqual(undefined);
    });

    it('should return correct value for getting an existing value in the parent SymbolTable', () => {
      const parentSymbolTable = new SymbolTable();

      parentSymbolTable.set('globalVar', new NumberType(0));

      const symbolTable = new SymbolTable(parentSymbolTable);
      const value: ValueType = symbolTable.get('globalVar');

      expect(value).toEqual(new NumberType(0));
    });
  });

  describe('remove tests', () => {
    it('should not do anything when calling remove on an empty SymbolTable', () => {
      const symbolTable = new SymbolTable();
      const expectedSymbols = new Map<string, NumberType>();
      const expectedParentTable: SymbolTable = null;

      expect(symbolTable.getSymbols()).toEqual(expectedSymbols);
      expect(symbolTable.getParent()).toEqual(expectedParentTable);

      symbolTable.remove('variable'); // Remove non-existent entry.

      // Should change anything in the symbolTable. Should remain empty.
      expect(symbolTable.getSymbols()).toEqual(expectedSymbols);
      expect(symbolTable.getParent()).toEqual(expectedParentTable);
    });

    it('should remove the correct entry from the SymbolTable when passing in an existing variable name to remove', () => {
      const symbolTable = new SymbolTable();
      symbolTable.set('variable', new NumberType(10));
      symbolTable.set('variable2', new NumberType(20));
      symbolTable.set('variable3', new NumberType(100));

      symbolTable.remove('variable');

      const value1: ValueType = symbolTable.get('variable');
      const value2: ValueType = symbolTable.get('variable2');
      const value3: ValueType = symbolTable.get('variable3');

      expect(value1).toEqual(undefined);
      expect(value2).toEqual(new NumberType(20));
      expect(value3).toEqual(new NumberType(100));
    });
  });
});
