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
