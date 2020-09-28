import { Parser } from './../logic/parser';
import { Injectable } from '@angular/core';
import { Lexer } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class InterpreterService {

  private lexer: Lexer;
  private parser: Parser;

  constructor() {
    this.lexer = new Lexer();
    this.parser = new Parser();
  }
}
