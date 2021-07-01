import { PositionTracker } from "../logic/position-tracker";
import { Token } from '../models/token';

export function createToken(type: string, posStart: PositionTracker, value?: any): Token {

  let token: Token;

  const posStartNew = posStart.copy();
  let posEnd = posStart.copy();
  posEnd.advance();

  if (value === undefined) {
    token = {
      type: type,
      positionStart: posStartNew,
      positionEnd: posEnd
    };
  }
  else {
    token = {
      type: type,
      positionStart: posStartNew,
      positionEnd: posEnd,
      value: value
    };
  }

  return token;
}

export function createTokenArray(tokenData: Array<[string, PositionTracker, any?]>): Array<Token> {

  let tokens: Array<Token> = [];

  for (let data of tokenData) {
    let token: Token;

    if (data.length === 2) {
      token = createToken(data[0], data[1]);
    }
    else {
      token = createToken(data[0], data[1], data[2]);
    }

    tokens.push(token);
  }

  return tokens;
}
