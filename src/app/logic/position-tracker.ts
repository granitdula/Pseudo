export class PositionTracker {

  constructor(private index: number, private line: number, private column: number) {}

  public advance(currentCharacter?: string): void {
    this.index++;
    this.column++;

    if (currentCharacter === '\n') {
      this.line++;
      this.column = 1;
    }
  }

  public copy(): PositionTracker {
    return new PositionTracker(this.index, this.line, this.column);
  }

  public getAllTrackerValues(): [number, number, number] {
    return [this.index, this.line, this.column];
  }

  public getIndex(): number {
    return this.index;
  }

  public getLine(): number {
    return this.line;
  }

  public getColumn(): number {
    return this.column;
  }
}
