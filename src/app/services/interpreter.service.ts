import { InvalidSyntaxError } from './../logic/invalid-syntax-error';
import { ASTNode } from './../models/ast-node';
import { Error } from './../logic/error';
import { Parser } from './../logic/parser';
import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { Lexer } from '../logic/lexer';
import { ParseResult } from '../logic/parse-result';

@Injectable({
  providedIn: 'root'
})
export class InterpreterService {

  private lexer: Lexer;
  private parser: Parser;

  constructor() {
    this.lexer = new Lexer();
  }

  public evaluate(source: string): string {

    let output = '';

    let lexerOutput: Array<Token> | Error = this.lexer.lex(source);

    if (lexerOutput instanceof Error) {
      output = lexerOutput.getErrorMessage();
    }
    else {
      this.parser = new Parser(lexerOutput);
      let parseResult: ParseResult = this.parser.parse();
      // TODO: Create visitor functionality to traverse AST and execute program.
    }

    return output;
  }
}
