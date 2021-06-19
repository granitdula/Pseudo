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
          shellOutput = runtimeResult.getValue().getValue().toString();

          for (const output of this.outputs) {
            consoleOutput += output + "\n";
          }
        }
      }
    }

    return [consoleOutput, shellOutput];
  }

  private initialiseGlobalSymbolTable(): SymbolTable {
    const globalSymbolTable = new SymbolTable();
    globalSymbolTable.set('TRUE', new NumberType(1));
    globalSymbolTable.set('FALSE', new NumberType(0));
    globalSymbolTable.set('PI', new NumberType(Math.PI));

    return globalSymbolTable;
  }

  private visitNode(node: ASTNode, context: Context): RuntimeResult {
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
      default:
        this.noVisitNode();
        break;
    }
  }

  private visitVarAccessNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const varName: string = node.token.value;
    let value: NumberType = context.symbolTable.get(varName);

    if (value === undefined) {
      const runtimeError = new RuntimeError(`${varName} is not defined`,
                                            node.token.positionStart,
                                            node.token.positionEnd, context);
      return runtimeResult.failure(runtimeError);
    }

    value = value.copy().setPos(node.token.positionStart, node.token.positionEnd);
    return runtimeResult.success(value);
  }

  private visitVarAssignNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const varName: string = node.token.value;
    const value: NumberType = runtimeResult.register(this.visitNode(<ASTNode>node.node, context));

    if (runtimeResult.getError() !== null) { return runtimeResult; }

    context.symbolTable.set(varName, value);
    return runtimeResult.success(value);
  }

  private visitBinaryOpNode(node: ASTNode, context: Context): RuntimeResult {
    const runtimeResult = new RuntimeResult();

    const left: NumberType = runtimeResult.register(this.visitNode(<ASTNode>node.leftChild, context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }
    const right: NumberType = runtimeResult.register(this.visitNode(<ASTNode>node.rightChild, context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    let error: RuntimeError = null;
    let result: NumberType;

    switch(node.token.type) {
      case TokenTypes.PLUS:
        result = left.addBy(right);
        break;
      case TokenTypes.MINUS:
        result = left.subtractBy(right);
        break;
      case TokenTypes.MULTIPLY:
        result = left.multiplyBy(right);
        break;
      case TokenTypes.DIVIDE:
        [result, error] = left.divideBy(right);
        break;
      case TokenTypes.POWER:
        result = left.poweredBy(right);
        break;
      case TokenTypes.EQUALITY:
        result = left.equalityComparison(right);
        break;
      case TokenTypes.L_THAN:
        result = left.lessThanComparison(right);
        break;
      case TokenTypes.G_THAN:
        result = left.greaterThanComparison(right);
        break;
      case TokenTypes.L_THAN_EQ:
        result = left.lessThanOrEqualComparison(right);
        break;
      case TokenTypes.G_THAN_EQ:
        result = left.greaterThanOrEqualComparison(right);
        break;
      case TokenTypes.KEYWORD:
        if (node.token.value === 'AND') { result = left.andBy(right); }
        else { result = left.orBy(right); }
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
    let number: NumberType = runtimeResult.register(this.visitNode(<ASTNode>node.node,
                                                                              context));
    if (runtimeResult.getError() !== null) { return runtimeResult; }

    // TODO: May need to handle runtime errors here in the future when adding other types like
    // strings.
    if (node.token.type === TokenTypes.MINUS) { number = number.multiplyBy(new NumberType(-1)); }
    else if (node.token.type === TokenTypes.KEYWORD && node.token.value === 'NOT') {
      number = number.notted();
    }

    return runtimeResult.success(number.setPos(node.token.positionStart, node.token.positionEnd));
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
