import { Injectable } from '@angular/core';
import { Lexer } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class InterpreterService {

  private lexer: Lexer;

  constructor() {
    this.lexer = new Lexer();
  }
}
