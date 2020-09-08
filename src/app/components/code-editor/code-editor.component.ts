import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent {

  private lineNumArray: number[] = [1];
  private lineNumber: number = 1;
  private scrollTop: number;
  @ViewChild('inputRegion') inputRegion: ElementRef<HTMLElement>;

  public updateLineNumber(): void {

    const text: string = this.inputRegion.nativeElement.innerText;
    const linesArr: string[] = text.split('\n');

    let newLineDoubleCounts = 0;

    for (let i = 0; i < linesArr.length - 1; i++) {
      if (linesArr[i] === '' && linesArr[i + 1] === '') {
        i++; // Skip next newline.
        newLineDoubleCounts++;
      }
    }

    // innerText double counts newlines, so need to remove to compensate.
    this.lineNumber =  linesArr.length - newLineDoubleCounts;
    this.updateLineNumArray();
    console.log(this.getScrollTop());
  }

  private updateLineNumArray(): void {
    // Unfortunately Angular's ngFor directive doesn't support iteration without
    // having an array to iterate over.
    this.lineNumArray = new Array(this.lineNumber).fill(0).map((x,i) => i + 1);
  }

  public getLineNumberArray(): number[] {
    return this.lineNumArray;
  }

  public syncEditorAndLineNumScrolling(): void {
    this.scrollTop = this.inputRegion.nativeElement.scrollTop;
  }

  public getScrollTop(): number {
    return this.scrollTop;
  }
}
