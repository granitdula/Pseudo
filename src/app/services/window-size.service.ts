import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {

  private readonly SENSITIVITY_DENOMINATOR: number = 10;
  private readonly MIN_WIDTH_PERCENT: number = 30;
  private readonly MAX_WIDTH_PERCENT: number = 64.2;
  private readonly START_WIDTH_PERCENT: number = 47.2;

  private editorWidth: BehaviorSubject<number>;
  private outputConsoleWidth: BehaviorSubject<number>;
  private changeSensitivity: number;

  public editorCast: Observable<number>;
  public outputCast: Observable<number>;

  constructor() {

    this.editorWidth = new BehaviorSubject(this.START_WIDTH_PERCENT);
    this.outputConsoleWidth = new BehaviorSubject(this.START_WIDTH_PERCENT);
    this.changeSensitivity = 0.8;

    this.editorCast = this.editorWidth.asObservable();
    this.outputCast = this.outputConsoleWidth.asObservable();
  }

  public adjustWindowWidths(deltaXPixels: number): void {

    const editorWidthVal: number = this.editorWidth.getValue();
    const outputWidthVal: number = this.outputConsoleWidth.getValue();

    const percentChange: number = deltaXPixels * (this.changeSensitivity / this.SENSITIVITY_DENOMINATOR);

    // Calculate width percent and bound it between min and max width
    const newEditorWidth: number = Math.max(Math.min(editorWidthVal + percentChange, this.MAX_WIDTH_PERCENT), this.MIN_WIDTH_PERCENT);
    const newOutputWidth: number = Math.max(Math.min(outputWidthVal - percentChange, this.MAX_WIDTH_PERCENT), this.MIN_WIDTH_PERCENT);

    this.editorWidth.next(newEditorWidth);
    this.outputConsoleWidth.next(newOutputWidth);
  }
}
