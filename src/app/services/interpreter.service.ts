import { FunctionType } from './../data-types/function-type';
import { ValueType } from './../data-types/value-type';
import { RuntimeError } from './../logic/runtime-error';
import { Context } from './../logic/context';
import { RuntimeResult } from './../logic/runtime-result';
import { InvalidSyntaxError } from './../logic/invalid-syntax-error';
import { ASTNode } from './../models/ast-node';
import { Error } from './../logic/error';
import { Parser } from './../logic/parser';
import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { Lexer } from '../logic/lexer';
import { ParseResult } from '../logic/parse-result';
import * as NodeTypes from '../constants/node-type.constants';
import * as TokenTypes from '../constants/token-type.constants';
import { NumberType } from '../data-types/number-type';
import { SymbolTable } from '../logic/symbol-table';

@Injectable({
  providedIn: 'root'
})
export class InterpreterService {

  private outputs: string[];
  private lexer: Lexer;
  private parser: Parser;

  constructor() {
    this.lexer = new Lexer();
  }

  public evaluate(source: string): [string, string] {

    let consoleOutput = '';
    let shellOutput: string;
    let runtimeResult: RuntimeResult;
    this.outputs = [];

    let lexerOutput: Array<Token> | Error = this.lexer.lex(source);

    if (lexerOutput instanceof Error) {
      consoleOutput = shellOutput = lexerOutput.getErrorMessage();
    }
    else {
      this.parser = new Parser(lexerOutput);
      let parseResult: ParseResult = this.parser.parse();

      if (parseResult.getError() !== null) {
        consoleOutput = shellOutput = parseResult.getError().getErrorMessage();
      }
      else {
        const rootContext = new Context('<pseudo>');
        rootContext.symbolTable = this.initialiseGlobalSymbolTable();
        runtimeResult = this.visitNode(<ASTNode>parseResult.getNode(), rootContext);

        if (runtimeResult.getError() !== null) {
          consoleOutput = shellOutput = runtimeResult.getError().getErrorMessage();
        }
        else {
          const runtimeValue: ValueType = runtimeResult.getValue();

          if (runtimeValue === null) { shellOutput = ''; }
          else if (runtimeValue instanceof NumberType) {
            shellOutput = runtimeValue.getValue().toString();
          }
          else if (runtimeValue instanceof FunctionType) {
            shellOutput = `function ${runtimeValue.getName()}`;
          }
          else { shellOutput = ''; }

          for (const output of this.outputs) {
            consoleOutput += output + "\n";
          }
        }
      }
    }

    return [consoleOutput, shellOutput];
  }

  public visitNode(node: ASTNode, context: Context): RuntimeResult {
    switch (node.nodeType) {
      case NodeTypes.NUMBER:
        return this.visitNumberNode(node, context);
      case NodeTypes.BINARYOP:
        return this.visitBinaryOpNode(node, context);
      case NodeTypes.UNARYOP:
        return this.visitUnaryOpNode(node, context);
      case NodeTypes.VARACCESS:
        return this.visitVarAccessNode(node, context);
      case NodeTypes.VARASSIGN:
        return this.visitVarAssignNode(node, context);
      case NodeTypes.IFSTATEMENT:
        return this.visitIfNode(node, context);
      case NodeTypes.FORLOOP:
        return this.visitForNode(node, context);
      case NodeTypes.WHILELOOP:
        return this.visitWhileNode(node, context);
      case NodeTypes.FUNCTIONDEF:
        return this.visitFunctionDefinion(node, context);
      case NodeTypes.FUNCTIONCALL:
        return this.visitFunctionCall(node, context);
      default:
        this.noVisitNode();
        break;
    }
  }

  private initialiseGlobalSymbolTable(): SymbolTable {
    const globalSymbolTable = new SymbolTable();
    globalSymbolTable.set('TRUE', new NumberType(1));
    globalSymbolTable.set('FALSE', new NumberType(0));
    globalSymbolTable.set('PI', new NumberType(Math.PI));

    return globalSymbolTable;
  }

  private visitFunctionCall(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();
    let args: ValueType[] = []; // Nodes of the arguments passed in the called function.

    let functionVal: ValueType = runtimeResult.register(this.visitNode(node.nodeToCall,
                                                                              context));
    if (!(functionVal instanceof FunctionType)) {
      const runtimeError = new RuntimeError('Can not make a call to a none FunctionType',
                                            node.token.positionStart, node.token.positionEnd,
                                            context);
      return runtimeResult.failure(runtimeError);
    }
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    // To reference the position of the function call, rather than function definition.
    functionVal = functionVal.copy().setPos(node.token.positionStart, node.token.positionEnd);

    for (let argNode of node.argNodes) {
      args.push(runtimeResult.register(this.visitNode(argNode, context)));
      if (runtimeResult.getError() !== null) { return runtimeResult; }
    }

    const returnValue: ValueType = runtimeResult.register(functionVal.execute(args));
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    return runtimeResult.success(returnValue);
  }

  private visitFunctionDefinion(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const funcName: string = node.varNameToken !== null ? node.varNameToken.value : null;
    let argNames: string[] = [];
    for (let argNameTok of node.argNameTokens) { argNames.push(argNameTok.value); }

    let functionVal: FunctionType;
    if (funcName !== null) { functionVal = new FunctionType(node.bodyNode, argNames, funcName); }
    else { functionVal = new FunctionType(node.bodyNode, argNames); }

    if (node.varNameToken !== null) { context.symbolTable.set(funcName, functionVal); }

    return runtimeResult.success(functionVal);
  }

  private visitWhileNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    while (true) {
      const conditionValue: ValueType = runtimeResult.register(this.visitNode(node.conditionNode, context));
      if (runtimeResult.getError() !== null) { return runtimeResult; }

      if (!conditionValue.isTrue()) { break; }

      runtimeResult.register(this.visitNode(node.bodyNode, context));
      if (runtimeResult.getError() !== null) { return runtimeResult; }
    }

    // Nothing is returned to the shell output as a single line statement.
    return runtimeResult.success(null);
  }

  private visitForNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const startValue: ValueType = runtimeResult.register(this.visitNode(node.startValueNode, context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    const endValue: ValueType = runtimeResult.register(this.visitNode(node.endValueNode, context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    let stepValue: ValueType = new NumberType(1);
    if (node.stepValueNode !== null) {
      stepValue = runtimeResult.register(this.visitNode(node.stepValueNode, context));
      if (runtimeResult.getError() !== null) { return runtimeResult; }
    }

    let startValNum: number;
    let endValNum: number;
    let stepValNum: number;
    if (startValue instanceof NumberType && endValue instanceof NumberType &&
                                              stepValue instanceof NumberType) {
      startValNum = startValue.getValue();
      endValNum = endValue.getValue();
      stepValNum = stepValue.getValue();
    }
    else {
      const runtimeError = new RuntimeError(`Start, end or step value is not a numerical value`,
                                            node.token.positionStart, node.token.positionEnd,
                                            context);
      return runtimeResult.failure(runtimeError);
    }

    let i: number = startValNum;
    let rangeCondition: ((currVal: number, endVal: number) => boolean);
    if (stepValNum >= 0) {
      rangeCondition = (currVal: number, endVal: number) => { return i < endValNum; }
    }
    else {
      rangeCondition = (currVal: number, endVal: number) => { return i > endValNum; }
    }

    while (rangeCondition(i, endValNum)) {
      context.symbolTable.set(node.varNameToken.value, new NumberType(i));
      i += stepValNum;

      runtimeResult.register(this.visitNode(node.bodyNode, context));
      if (runtimeResult.getError() !== null) { return runtimeResult; }
    }

    // Nothing is returned to the shell output as a single line statement.
    return runtimeResult.success(null);
  }

  private visitIfNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    for (let [condNode, exprNode] of node.cases) {
      const conditionValue: ValueType = runtimeResult.register(this.visitNode(condNode, context));
      if(runtimeResult.getError() !== null) { return runtimeResult; }

      if (conditionValue.isTrue()) {
        const exprValue: ValueType = runtimeResult.register(this.visitNode(exprNode, context));
        if(runtimeResult.getError() !== null) { return runtimeResult; }

        return runtimeResult.success(exprValue);
      }
    }

    if (node.elseCase !== null) {
      const elseValue: ValueType = runtimeResult.register(this.visitNode(node.elseCase, context));
      if(runtimeResult.getError() !== null) { return runtimeResult; }

      return runtimeResult.success(elseValue);
    }

    return runtimeResult.success(null);
  }

  private visitVarAccessNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const varName: string = node.token.value;
    let value: ValueType = context.symbolTable.get(varName);

    if (value === undefined) {
      const runtimeError = new RuntimeError(`${varName} is not defined`,
                                            node.token.positionStart,
                                            node.token.positionEnd, context);
      return runtimeResult.failure(runtimeError);
    }

    if (value instanceof NumberType) {
      value = value.copy().setPos(node.token.positionStart, node.token.positionEnd);
    }
    else { throw new ErrorEvent(`Can't create copy of data type`); }

    return runtimeResult.success(value);
  }

  private visitVarAssignNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const varName: string = node.token.value;
    const value: ValueType = runtimeResult.register(this.visitNode(<ASTNode>node.node, context));

    if (runtimeResult.getError() !== null) { return runtimeResult; }

    context.symbolTable.set(varName, value);
    return runtimeResult.success(value);
  }

  private visitBinaryOpNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const left: ValueType = runtimeResult.register(this.visitNode(<ASTNode>node.leftChild, context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }
    const right: ValueType = runtimeResult.register(this.visitNode(<ASTNode>node.rightChild, context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    let error: RuntimeError = null;
    let result: ValueType;

    switch(node.token.type) {
      case TokenTypes.PLUS:
        [result, error] = left.addBy(right);
        break;
      case TokenTypes.MINUS:
        [result, error] = left.subtractBy(right);
        break;
      case TokenTypes.MULTIPLY:
        [result, error] = left.multiplyBy(right);
        break;
      case TokenTypes.DIVIDE:
        [result, error] = left.divideBy(right);
        break;
      case TokenTypes.POWER:
        [result, error] = left.poweredBy(right);
        break;
      case TokenTypes.EQUALITY:
        [result, error] = left.equalityComparison(right);
        break;
      case TokenTypes.L_THAN:
        [result, error] = left.lessThanComparison(right);
        break;
      case TokenTypes.G_THAN:
        [result, error] = left.greaterThanComparison(right);
        break;
      case TokenTypes.L_THAN_EQ:
        [result, error] = left.lessThanOrEqualComparison(right);
        break;
      case TokenTypes.G_THAN_EQ:
        [result, error] = left.greaterThanOrEqualComparison(right);
        break;
      case TokenTypes.KEYWORD:
        if (node.token.value === 'AND') { [result, error] = left.andBy(right); }
        else { [result, error] = left.orBy(right); }
        break;
      default:
        break;
    }

    if (error !== null) { return runtimeResult.failure(error); }
    else {
      return runtimeResult.success(result.setPos(node.token.positionStart,
                                                 node.token.positionEnd));
    }
  }

  private visitUnaryOpNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();
    let number: ValueType = runtimeResult.register(this.visitNode(<ASTNode>node.node,
                                                                              context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    let error: RuntimeError = null;

    if (node.token.type === TokenTypes.MINUS) { [number, error] = number.multiplyBy(new NumberType(-1)); }
    else if (node.token.type === TokenTypes.KEYWORD && node.token.value === 'NOT') {
      [number, error] = number.notted();
    }

    if (error !== null) { return runtimeResult.failure(error); }
    else {
      return runtimeResult.success(number.setPos(node.token.positionStart, node.token.positionEnd));
    }
  }

  private visitNumberNode(node: ASTNode, context: Context): RuntimeResult {
    const number = new NumberType(node.token.value);
    number.setContext(context).setPos(node.token.positionStart, node.token.positionEnd);
    return new RuntimeResult().success(number);
  }

  private noVisitNode(): RuntimeResult {
    throw new ErrorEvent('Undefined visit method');
  }
}
