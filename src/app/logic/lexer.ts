import { KEYWORDS } from './../constants/keywords.constants';
import { PositionTracker } from './position-tracker';
import { Error } from './error';
import { InvalidCharacterError } from './invalid-character-error';
import { Token } from '../models/token';
import * as TokenTypes from '../constants/token-type.constants';
import { createToken } from '../utils/token-functions';

export class Lexer {

  private positionTracker: PositionTracker;

  constructor() {
    this.positionTracker = new PositionTracker(0, 1, 1);
  }

  public lex(source: string): Array<Token> | Error {

    let tokens: Array<Token> = [];

    while (source.length !== 0 && this.positionTracker.getIndex() < source.length) {
      let startOfTokenPosTracker = this.positionTracker.copy();
      let startOfTokenPosEnd: PositionTracker = startOfTokenPosTracker.copy();
      startOfTokenPosEnd.advance();
      let char: string = source.charAt(this.positionTracker.getIndex());
      let singleCharTokenType: string | null = this.getSingleCharacterTokenType(char);
      let compTokenType: string | Error | null = this.getComparatorTokenType(source);

      if (char === ' ') {
        this.positionTracker.advance();
      }
      else if (char === '\t') {
        const error: InvalidCharacterError = new InvalidCharacterError('contains tabs.',
                                                                       startOfTokenPosTracker,
                                                                       startOfTokenPosEnd);
        return error;
      }
      else if (singleCharTokenType !== null) {
        const token: Token = createToken(singleCharTokenType, startOfTokenPosTracker);
        tokens.push(token);
        this.positionTracker.advance(char); // Passed arg to check for newline char.
      }
      else if (compTokenType instanceof Error) {
        return compTokenType;
      }
      else if (typeof compTokenType === 'string') {
        tokens.push(createToken(compTokenType, startOfTokenPosTracker));
        this.positionTracker.advance();
      }
      else if (this.isDigit(char)) {
        const result: number | Error = this.scanNumber(source);

        if (result instanceof Error) {
          return result;
        }
        else{
          const token: Token = createToken(TokenTypes.NUMBER, startOfTokenPosTracker, result);
          tokens.push(token);
        }
      }
      else if (char === '"') {
        const stringValue: string | Error = this.scanString(source);

        if (stringValue instanceof Error) { return stringValue; }
        else {
          const token: Token = createToken(TokenTypes.STRING, startOfTokenPosTracker,
                                                                             stringValue);
          tokens.push(token);
        }
      }
      else if (this.isAlphabeticalCharacter(char) || char === '_') {
        const result: string = this.scanIdentifier(source);
        const tokenType = KEYWORDS.has(result) ? TokenTypes.KEYWORD : TokenTypes.IDENTIFIER;
        const token: Token = createToken(tokenType, startOfTokenPosTracker, result);

        tokens.push(token);
      }
      else {
        const errorMessage = `the character '${char}' is not valid.`;
        return new InvalidCharacterError(errorMessage, startOfTokenPosTracker,
                                                            startOfTokenPosEnd);
      }
    }

    const eofToken: Token = createToken(TokenTypes.EOF, this.positionTracker);
    tokens.push(eofToken);

    return tokens;
  }

  private getSingleCharacterTokenType(char: string): string | null {

    let tokenType: string | null;

    switch (char) {
      case '\n':
        tokenType = TokenTypes.NEWLINE;
        break;
      case '+':
        tokenType = TokenTypes.PLUS;
        break;
      case '-':
        tokenType = TokenTypes.MINUS;
        break;
      case '*':
        tokenType = TokenTypes.MULTIPLY;
        break;
      case '/':
        tokenType = TokenTypes.DIVIDE;
        break;
      case '^':
        tokenType = TokenTypes.POWER;
        break;
      case '(':
        tokenType = TokenTypes.L_BRACKET;
        break;
      case ')':
        tokenType = TokenTypes.R_BRACKET;
        break;
      case '[':
        tokenType = TokenTypes.L_SQUARE;
        break;
      case ']':
        tokenType = TokenTypes.R_SQUARE;
        break;
      case ',':
        tokenType = TokenTypes.COMMA;
        break;
      default:
        tokenType = null;
        break;
    }

    return tokenType;
  }

  private getComparatorTokenType(source: string): string | Error | null {

    const startPos: PositionTracker = this.positionTracker.copy();
    let endPos: PositionTracker = this.positionTracker.copy();
    endPos.advance();
    const charIndex = this.positionTracker.getIndex();
    const char = source.charAt(charIndex);

    if (charIndex + 1 >= source.length) {
      if (char === '=') {
        const errorMessage: string = `can not end line statement with '='.`;
        return new InvalidCharacterError(errorMessage, startPos, endPos);
      }
      else if (char === '>') {
        const errorMessage: string = `can not end line statement with '>'.`;
        return new InvalidCharacterError(errorMessage, startPos, endPos);
      }
      else if (char === '<') {
        const errorMessage: string = `can not end line statement with '<'.`;
        return new InvalidCharacterError(errorMessage, startPos, endPos);
      }
      else {
        return null;
      }
    }
    else {
      if (char === '=' || char === '>' || char === '<') {
        const nextChar: string = source.charAt(charIndex + 1);
        return this.getSpecificComparatorTokenType(char, nextChar);
      }
      else {
        return null;
      }
    }
  }

  private getSpecificComparatorTokenType(char: string, nextChar: string): string {

    if (nextChar === '=') {
      this.positionTracker.advance();

      if (char === '=') {
        return TokenTypes.EQUALITY;
      }
      else if (char === '>') {
        return TokenTypes.G_THAN_EQ;
      }
      else {
        return TokenTypes.L_THAN_EQ;
      }
    }
    else {
      if (char === '=') {
        return TokenTypes.EQUALS;
      }
      else if (char === '>') {
        return TokenTypes.G_THAN;
      }
      else {
        return TokenTypes.L_THAN;
      }
    }
  }

  private isDigit(x: string): boolean {

    if (x.length === 0 || x.length > 1) { return false; }

    return x >= '0' && x <= '9';
  }

  private scanNumber(source: string): number | Error {

    const initialStartPos: PositionTracker = this.positionTracker.copy();
    const initialEndPos: PositionTracker = this.positionTracker.copy();
    initialEndPos.advance();
    let char: string = source.charAt(this.positionTracker.getIndex());
    let value: string = '';
    let numberOfDots = 0;

    while ((char === '.' || this.isDigit(char)) &&
           this.positionTracker.getIndex() < source.length) {
      if (char === '.') {
        numberOfDots++;
      }

      value = value + char;

      this.positionTracker.advance();
      char = source.charAt(this.positionTracker.getIndex());
    }

    if (numberOfDots > 1) {
      const errorMessage = 'number has more than one decimal point.';
      const error: InvalidCharacterError = new InvalidCharacterError(errorMessage,
                                                                     initialStartPos,
                                                                     initialEndPos);

      return error;
    }
    else {
      return parseFloat(value);
    }
  }

  private scanString(source: string): string | Error {
    let stringValue = '';

    this.positionTracker.advance();
    let char: string = source.charAt(this.positionTracker.getIndex());

    let isEscapeCharacter = false;
    const escapeCharacterMap = new Map<string, string>([
      ['t', '\t'], ['n', '\n'], ['"', '"']
    ]);

    while ((char !== '"' || isEscapeCharacter) &&
           this.positionTracker.getIndex() < source.length) {
      if (isEscapeCharacter) {
        if (escapeCharacterMap.get(char) !== undefined) {
          stringValue += escapeCharacterMap.get(char);
          isEscapeCharacter = false;
        }
      }
      else if (char === '\\') { isEscapeCharacter = true; }
      else { stringValue += char; }

      this.positionTracker.advance();
      char = source.charAt(this.positionTracker.getIndex());
    }

    if (char !== '"') {
      const errorMessage = 'missing closing " in string';
      const posEnd = this.positionTracker.copy();
      posEnd.advance();
      const error: InvalidCharacterError = new InvalidCharacterError(errorMessage,
                                                                     this.positionTracker,
                                                                     posEnd);

      return error;
    }

    this.positionTracker.advance();

    return stringValue;
  }

  private isAlphabeticalCharacter(char: string): boolean {

    if (char.length === 0 || char.length > 1) { return false; }

    // Javascript maps lower case letters to upper case with these built in
    // functions, hence can be used as a check for alphabetical letters.
    return char.toUpperCase() != char.toLowerCase();
  }

  private scanIdentifier(source: string): string {

    let char: string = source.charAt(this.positionTracker.getIndex());
    let value: string = '';
    let considerNumbers = false;

    while ((this.isAlphabeticalCharacter(char) || char === '_' ||
           (considerNumbers && this.isDigit(char))) &&
           this.positionTracker.getIndex() < source.length) {
      value = value + char

      this.positionTracker.advance();
      char = source.charAt(this.positionTracker.getIndex());
      considerNumbers = true;
    }

    return value;
  }
}
