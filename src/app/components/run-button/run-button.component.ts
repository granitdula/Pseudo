import { Component, HostListener } from '@angular/core';
import { InterpreterService } from 'src/app/services/interpreter.service';

@Component({
  selector: 'app-run-button',
  templateUrl: './run-button.component.html',
  styleUrls: ['./run-button.component.css']
})
export class RunButtonComponent {

  constructor(private interpreter: InterpreterService) {}

  @HostListener('click')
  onClick() {
    console.log('CLICKED!');
  }
}
