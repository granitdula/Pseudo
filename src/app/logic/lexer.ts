import { Error } from './error';
import { InvalidCharacterError } from './invalid-character-error';
import { Token } from '../models/token';
import * as TokenTypes from './token-type.constants';

export class Lexer {

  private charIndex: number;

  constructor() {
    this.charIndex = 0;
  }

  public lex(source: string): Array<Token> | Error {

    let tokens: Array<Token> = [];

    while (source.length !== 0 && this.charIndex < source.length) {
      let char: string = source.charAt(this.charIndex);

      if (char === ' ') {
        this.charIndex++;
      }
      else if (char === '\n') {
        const token: Token = this.createToken(TokenTypes.NEWLINE);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === '\t') {
        const error: InvalidCharacterError = new InvalidCharacterError('contains tabs.');
        return error;
      }
      else if (char === '+') {
        const token: Token = this.createToken(TokenTypes.PLUS);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === '-') {
        const token: Token = this.createToken(TokenTypes.MINUS);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === '*') {
        const token: Token = this.createToken(TokenTypes.MULTIPLY);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === '/') {
        const token: Token = this.createToken(TokenTypes.DIVIDE);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === '^') {
        const token: Token = this.createToken(TokenTypes.POWER);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === '(') {
        const token: Token = this.createToken(TokenTypes.L_BRACKET);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === ')') {
        const token: Token = this.createToken(TokenTypes.R_BRACKET);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === ',') {
        const token: Token = this.createToken(TokenTypes.COMMA);
        tokens.push(token);
        this.charIndex++;
      }
      else if (char === '=') {
        if (this.charIndex + 1 >= source.length) {
          const errorMessage: string = `can not end line statement with '='.`;
          const error: InvalidCharacterError = new InvalidCharacterError(errorMessage);
          return error;
        }
        else {
          const nextChar: string = source.charAt(this.charIndex + 1);
          let token: Token

          if (nextChar === '=') {
            token = this.createToken(TokenTypes.EQUALITY);
            this.charIndex++;
          }
          else{
            token = this.createToken(TokenTypes.EQUALS);
          }

          tokens.push(token);
          this.charIndex++;
        }
      }
      else if (char === '>') {
        if (this.charIndex + 1 >= source.length) {
          const errorMessage: string = `can not end line statement with '>'.`;
          const error: InvalidCharacterError = new InvalidCharacterError(errorMessage);
          return error;
        }
        else {
          const nextChar: string = source.charAt(this.charIndex + 1);
          let token: Token

          if (nextChar === '=') {
            token = this.createToken(TokenTypes.G_THAN_EQ);
            this.charIndex++;
          }
          else{
            token = this.createToken(TokenTypes.G_THAN);
          }

          tokens.push(token);
          this.charIndex++;
        }
      }
      else if (char === '<') {
        if (this.charIndex + 1 >= source.length) {
          const errorMessage: string = `can not end line statement with '<'.`;
          const error: InvalidCharacterError = new InvalidCharacterError(errorMessage);
          return error;
        }
        else {
          const nextChar: string = source.charAt(this.charIndex + 1);
          let token: Token

          if (nextChar === '=') {
            token = this.createToken(TokenTypes.L_THAN_EQ);
            this.charIndex++;
          }
          else{
            token = this.createToken(TokenTypes.L_THAN);
          }

          tokens.push(token);
          this.charIndex++;
        }
      }
      else if (this.isDigit(char)) {
        const result: number | Error = this.scanNumber(source);

        if (result instanceof Error) {
          return result;
        }
        else{
          const token: Token = this.createToken(TokenTypes.NUMBER, result);
          tokens.push(token);
        }
      }
      else if (this.isAlphabeticalCharacter(char)) {
        const result: string = this.scanString(source);
        const token: Token = this.createToken(TokenTypes.IDENTIFIER, result);
        tokens.push(token);
      }
      else {
        const errorMessage = `the character '${char}' is not valid.`;
        const error: InvalidCharacterError = new InvalidCharacterError(errorMessage);
        return error;
      }
    }

    return tokens;
  }

  private createToken(type: string, value?: any): Token {

    let token: Token;

    if (value === undefined) {
      token = { type: type };
    }
    else {
      token = {
        type: type,
        value: value
      };
    }

    return token;
  }

  private isDigit(x: string): boolean {

    if (x.length === 0 || x.length > 1) { return false; }

    return x >= '0' && x <= '9';
  }

  private scanNumber(source: string): number | Error {

    let char: string = source.charAt(this.charIndex);
    let value: string = '';
    let numberOfDots = 0;

    while ((char === '.' || this.isDigit(char)) && this.charIndex < source.length) {
      if (char === '.') {
        numberOfDots++;
      }

      value = value + char;

      this.charIndex++;
      char = source.charAt(this.charIndex);
    }

    if (numberOfDots > 1) {
      const errorMessage = 'number has more than one decimal point.';
      const error: InvalidCharacterError = new InvalidCharacterError(errorMessage);

      return error;
    }
    else {
      return parseFloat(value);
    }
  }

  private isAlphabeticalCharacter(char: string): boolean {

    if (char.length === 0 || char.length > 1) { return false; }

    // Javascript maps lower case letters to upper case with these built in
    // functions, hence can be used as a check for alphabetical letters.
    return char.toUpperCase() != char.toLowerCase();
  }

  private scanString(source: string): string {

    let char: string = source.charAt(this.charIndex);
    let value: string = '';

    while (this.isAlphabeticalCharacter(char) && this.charIndex < source.length) {
      value = value + char

      this.charIndex++;
      char = source.charAt(this.charIndex);
    }

    return value;
  }
}
