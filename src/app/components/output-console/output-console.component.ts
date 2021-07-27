import { ConsoleTextService } from './../../services/console-text.service';
import { WindowSizeService } from './../../services/window-size.service';
import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-output-console',
  templateUrl: './output-console.component.html',
  styleUrls: ['./output-console.component.css']
})
export class OutputConsoleComponent implements OnInit {

  @HostBinding('style.width.%') private width: number;
  // private output: string = '';

  constructor(private windowSizeService: WindowSizeService,
              private consoleTextService: ConsoleTextService) {}

  ngOnInit() {
    this.windowSizeService.outputCast.subscribe(outputWidth => this.width = outputWidth);
  }

  // public outputText(htmlText: string): void {
  //   this.output = htmlText;
  // }

  public getOutput(): string {
    return this.consoleTextService.getOutput();
  }
}
