import { InvalidSyntaxError } from './../logic/invalid-syntax-error';
import { ASTNode } from './../models/ast-node';
import { Error } from './../logic/error';
import { Parser } from './../logic/parser';
import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { Lexer } from '../logic/lexer';
import { ParseResult } from '../logic/parse-result';
import * as NodeTypes from '../constants/node-type.constants';

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

  public evaluate(source: string): any[] {

    let consoleOutput = '';
    let shellOutput: any;
    this.outputs = [];

    let lexerOutput: Array<Token> | Error = this.lexer.lex(source);

    if (lexerOutput instanceof Error) {
      consoleOutput = lexerOutput.getErrorMessage();
    }
    else {
      this.parser = new Parser(lexerOutput);
      let parseResult: ParseResult = this.parser.parse();

      if (parseResult.getError() !== null) {
        consoleOutput = shellOutput = parseResult.getError().getErrorMessage();
      }
      else {
        shellOutput = this.visitNode(<ASTNode>parseResult.getNode());

        for (const output of this.outputs) {
          consoleOutput += output + "\n";
        }
      }
    }

    return [consoleOutput, shellOutput];
  }

  private visitNode(node: ASTNode) {
    switch (node.nodeType) {
      case NodeTypes.NUMBER:
        return this.visitNumberNode(node);
      case NodeTypes.BINARYOP:
        return this.visitBinaryOpNode(node);
      case NodeTypes.UNARYOP:
        return this.visitUnaryOpNode(node);
      default:
        this.noVisitNode();
        break;
    }
  }

  private visitBinaryOpNode(node: ASTNode) {
    console.log('Found binary operator node!');
    this.visitNode(<ASTNode>node.leftChild);
    this.visitNode(<ASTNode>node.rightChild);
  }

  private visitUnaryOpNode(node: ASTNode) {
    console.log('Found unary operator node!');
    this.visitNode(<ASTNode>node.node);
  }

  private visitNumberNode(node: ASTNode) {
    console.log('Found number node!');
  }

  private noVisitNode(): void {
    throw new ErrorEvent('Undefined visit method');
  }
}
