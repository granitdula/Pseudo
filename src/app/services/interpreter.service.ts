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

  private visitNode(node: ASTNode, context: Context): RuntimeResult {
    switch (node.nodeType) {
      case NodeTypes.NUMBER:
        return this.visitNumberNode(node, context);
      case NodeTypes.BINARYOP:
        return this.visitBinaryOpNode(node, context);
      case NodeTypes.UNARYOP:
        return this.visitUnaryOpNode(node, context);
      default:
        this.noVisitNode();
        break;
    }
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
