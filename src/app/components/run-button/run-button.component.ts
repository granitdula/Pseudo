import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-run-button',
  templateUrl: './run-button.component.html',
  styleUrls: ['./run-button.component.css']
})
export class RunButtonComponent {

  @HostListener('click')
  onClick() {
    console.log('CLICKED!');
  }
}
