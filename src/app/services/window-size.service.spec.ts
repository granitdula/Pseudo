import { TestBed } from '@angular/core/testing';

import { WindowSizeService } from './window-size.service';

describe('WindowSizeService', () => {
  let service: WindowSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowSizeService);
  });

  describe('Main service test', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be instantiated with editor of width 47.2 percent', () => {

      let editorWidth: number;
      const expected: number = 47.2;

      service.editorCast.subscribe(width => editorWidth = width);

      expect(editorWidth).toEqual(expected);
    });

    it('should be instantiated with output console width of 47.2 percent', () => {

      let outputWidth: number;
      const expected: number = 47.2;

      service.outputCast.subscribe(width => outputWidth = width);

      expect(outputWidth).toEqual(expected);
    });
  });

  describe('adjustWindowWidths tests', () => {
    it('should give 47.2 percent for both editor and output width if change in x movement is 0 pixels after initialisation', () => {

      let editorWidth: number;
      let outputWidth: number;

      const expectedEditorWidthPercent: number = 47.2;
      const expectedOutputWidthPercent: number = 47.2;

      const deltaXPixels: number = 0;

      service.adjustWindowWidths(deltaXPixels);

      service.editorCast.subscribe(width => editorWidth = width);
      service.outputCast.subscribe(width => outputWidth = width);

      expect(editorWidth).toEqual(expectedEditorWidthPercent);
      expect(outputWidth).toEqual(expectedOutputWidthPercent);
    });

    it('should give correct width for editor and output if change in x movement is 20 pixels', () => {

      const helper: Helper = new Helper();

      helper.adjustWindowWidths(20);

      service.adjustWindowWidths(20);

      let editorWidth: number;
      let outputWidth: number;

      service.editorCast.subscribe(width => editorWidth = width);
      service.outputCast.subscribe(width => outputWidth = width);

      expect(editorWidth).toEqual(helper.expectedEditorWidth);
      expect(outputWidth).toEqual(helper.expectedOutputWidth);
    });

    it('should give correct width for editor and output if change in x movement is -15 pixels', () => {

      const helper: Helper = new Helper();

      helper.adjustWindowWidths(-15);

      service.adjustWindowWidths(-15);

      let editorWidth: number;
      let outputWidth: number;

      service.editorCast.subscribe(width => editorWidth = width);
      service.outputCast.subscribe(width => outputWidth = width);

      expect(editorWidth).toEqual(helper.expectedEditorWidth);
      expect(outputWidth).toEqual(helper.expectedOutputWidth);
    });

    it('should limit width percent to 64.2 for editor and 30 for output if change in x movement is high positive value', () => {

      const expectedEditorWidth: number = 64.2;
      const expectedOutputWidth: number = 30;

      service.adjustWindowWidths(10000);

      let editorWidth: number;
      let outputWidth: number;

      service.editorCast.subscribe(width => editorWidth = width);
      service.outputCast.subscribe(width => outputWidth = width);

      expect(editorWidth).toEqual(expectedEditorWidth);
      expect(outputWidth).toEqual(expectedOutputWidth);
    });

    it('should limit width percent to 30 for editor and 64.2 for output if change in x movement is high negative value', () => {

      const expectedEditorWidth: number = 30;
      const expectedOutputWidth: number = 64.2;

      service.adjustWindowWidths(-10000);

      let editorWidth: number;
      let outputWidth: number;

      service.editorCast.subscribe(width => editorWidth = width);
      service.outputCast.subscribe(width => outputWidth = width);

      expect(editorWidth).toEqual(expectedEditorWidth);
      expect(outputWidth).toEqual(expectedOutputWidth);
    });
  });
});

class Helper {

  private changeSensitivity: number = 0.8;
  private sensitivityDenom: number = 10;
  private minWidth: number = 30;
  private maxWidth: number = 64.2;
  private startWidth: number = 47.2;

  public expectedEditorWidth: number;
  public expectedOutputWidth: number;

  constructor() {}

  public adjustWindowWidths(deltaXPixels: number) {

    const percentChange: number = deltaXPixels * (this.changeSensitivity / this.sensitivityDenom);

    this.expectedEditorWidth = Math.max(Math.min(this.startWidth + percentChange, this.maxWidth), this.minWidth);
    this.expectedOutputWidth = Math.max(Math.min(this.startWidth - percentChange, this.maxWidth), this.minWidth);
  }
}
