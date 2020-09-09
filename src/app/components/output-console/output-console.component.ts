import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-output-console',
  templateUrl: './output-console.component.html',
  styleUrls: ['./output-console.component.css']
})
export class OutputConsoleComponent {

  private output: string = '';

  public outputText(htmlText: string): void {
    this.output = htmlText;
  }

  public getOutput(): string {
    return this.output;
  }
}
