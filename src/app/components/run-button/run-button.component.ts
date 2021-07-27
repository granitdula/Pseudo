import { ConsoleTextService } from './../../services/console-text.service';
import { Component, HostListener } from '@angular/core';
import { InterpreterService } from 'src/app/services/interpreter.service';

@Component({
  selector: 'app-run-button',
  templateUrl: './run-button.component.html',
  styleUrls: ['./run-button.component.css']
})
export class RunButtonComponent {

  constructor(private interpreter: InterpreterService,
              private consoleTextService: ConsoleTextService) {}

  @HostListener('click')
  onClick() {
    let source = this.consoleTextService.getInput();
    let [consOut, shellOut] = this.interpreter.evaluate(source);

    // Replaces all newline characters with <br> tags.
    consOut = consOut.replace(/(?:\r\n|\r|\n)/g, '<br>');

    this.consoleTextService.setOutput(consOut);
  }
}
