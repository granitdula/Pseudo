import { RuntimeResult } from './../logic/runtime-result';
import { Context } from './../logic/context';
import { NumberType } from './number-type';
import { PositionTracker } from './../logic/position-tracker';
import { ASTNode } from './../models/ast-node';
import { FunctionType } from './function-type';
import * as NodeTypes from '../constants/node-type.constants';
import * as TokenTypes from '../constants/token-type.constants';
import {createToken} from '../utils/token-functions';
import { SymbolTable } from '../logic/symbol-table';

describe('FunctionType tests', () => {
  describe('execute tests', () => {
    it('should return correct value when calling function with correct arguments', () => {
      const posStartFunction = new PositionTracker(0, 1, 1);
      const posEndFunction = new PositionTracker(1, 1, 2);
      const posStartX = new PositionTracker(25, 1, 26);
      const posStartPlus = new PositionTracker(27, 1, 28);
      const posStartY = new PositionTracker(29, 1, 30);

      const number1 = new NumberType(1);
      const number2 = new NumberType(2);
      const functionContext = new Context('add');
      functionContext.symbolTable = new SymbolTable();

      const varX: ASTNode = {
        nodeType: NodeTypes.VARACCESS,
        token: createToken(TokenTypes.IDENTIFIER, posStartX, 'x')
      };
      const varY: ASTNode = {
        nodeType: NodeTypes.VARACCESS,
        token: createToken(TokenTypes.IDENTIFIER, posStartY, 'y')
      };
      const addNode: ASTNode = {
        nodeType: NodeTypes.BINARYOP,
        token: createToken(TokenTypes.PLUS, posStartPlus),
        leftChild: varX,
        rightChild: varY
      };
      const args: string[] = ['x', 'y'];

      const functionType = new FunctionType(addNode, args, 'add');

      // Create function scope.
      functionType.setPos(posStartFunction, posEndFunction);
      functionType.setContext(functionContext);
      functionType.getContext().symbolTable.set('x', number1);
      functionType.getContext().symbolTable.set('y', number2);

      const value: NumberType = <NumberType>functionType.execute([number1, number2]).getValue();
      expect(value.getValue()).toEqual(3);
    });

    it('should return runtime result error for to few arguments', () => {
      const posStartFunction = new PositionTracker(0, 1, 1);
      const posEndFunction = new PositionTracker(1, 1, 2);
      const posStartX = new PositionTracker(25, 1, 26);
      const posStartPlus = new PositionTracker(27, 1, 28);
      const posStartY = new PositionTracker(29, 1, 30);

      const number1 = new NumberType(1);
      const number2 = new NumberType(2);
      const functionContext = new Context('add');
      functionContext.symbolTable = new SymbolTable();

      const varX: ASTNode = {
        nodeType: NodeTypes.VARACCESS,
        token: createToken(TokenTypes.IDENTIFIER, posStartX, 'x')
      };
      const varY: ASTNode = {
        nodeType: NodeTypes.VARACCESS,
        token: createToken(TokenTypes.IDENTIFIER, posStartY, 'y')
      };
      const addNode: ASTNode = {
        nodeType: NodeTypes.BINARYOP,
        token: createToken(TokenTypes.PLUS, posStartPlus),
        leftChild: varX,
        rightChild: varY
      };
      const args: string[] = ['x', 'y'];

      const functionType = new FunctionType(addNode, args, 'add');

      // Create function scope.
      functionType.setPos(posStartFunction, posEndFunction);
      functionType.setContext(functionContext);
      functionType.getContext().symbolTable.set('x', number1);
      functionType.getContext().symbolTable.set('y', number2);

      const result: RuntimeResult = functionType.execute([number1]);

      const expectedErrorMessage = `Traceback (most recent call last):\nLine 1, in add\nRuntime` +
                                   ` Error: 1 arguments were passed into add. Expected 2\n` +
                                   `At line: 1 column: 1 and ends at line: 1 column: 2`;

      expect(result.getError().getErrorMessage()).toEqual(expectedErrorMessage);
    });

    it('should return runtime result error for to many arguments', () => {
      const posStartFunction = new PositionTracker(0, 1, 1);
      const posEndFunction = new PositionTracker(1, 1, 2);
      const posStartX = new PositionTracker(25, 1, 26);
      const posStartPlus = new PositionTracker(27, 1, 28);
      const posStartY = new PositionTracker(29, 1, 30);

      const number1 = new NumberType(1);
      const number2 = new NumberType(2);
      const number3 = new NumberType(2);
      const functionContext = new Context('add');
      functionContext.symbolTable = new SymbolTable();

      const varX: ASTNode = {
        nodeType: NodeTypes.VARACCESS,
        token: createToken(TokenTypes.IDENTIFIER, posStartX, 'x')
      };
      const varY: ASTNode = {
        nodeType: NodeTypes.VARACCESS,
        token: createToken(TokenTypes.IDENTIFIER, posStartY, 'y')
      };
      const addNode: ASTNode = {
        nodeType: NodeTypes.BINARYOP,
        token: createToken(TokenTypes.PLUS, posStartPlus),
        leftChild: varX,
        rightChild: varY
      };
      const args: string[] = ['x', 'y'];

      const functionType = new FunctionType(addNode, args, 'add');

      // Create function scope.
      functionType.setPos(posStartFunction, posEndFunction);
      functionType.setContext(functionContext);
      functionType.getContext().symbolTable.set('x', number1);
      functionType.getContext().symbolTable.set('y', number2);

      const result: RuntimeResult = functionType.execute([number1, number2, number3]);

      const expectedErrorMessage = `Traceback (most recent call last):\nLine 1, in add\nRuntime` +
                                   ` Error: 3 arguments were passed into add. Expected 2\n` +
                                   `At line: 1 column: 1 and ends at line: 1 column: 2`;

      expect(result.getError().getErrorMessage()).toEqual(expectedErrorMessage);
    });
  });

  describe('copy tests', () => {
    it('should return a new copied instance of the FunctionType when calling copy', () => {
      const posStartNum = new PositionTracker(10, 1, 11);
      const number: ASTNode = {
        nodeType: NodeTypes.NUMBER,
        token: createToken(TokenTypes.NUMBER, posStartNum, 1),
      };
      const functionType = new FunctionType(number, [], 'func');

      const copiedFunctionType: FunctionType = functionType.copy();

      expect(functionType).toEqual(copiedFunctionType);
    });
  });
});
