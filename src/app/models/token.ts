import { PositionTracker } from './../logic/position-tracker';

export interface Token {
  type: string,
  positionStart: PositionTracker,
  positionEnd: PositionTracker,
  value?: any
}
