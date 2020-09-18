import { WindowSizeService } from './../../services/window-size.service';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-drag-bar',
  templateUrl: './drag-bar.component.html',
  styleUrls: ['./drag-bar.component.css']
})
export class DragBarComponent implements OnInit {

  private isDragging: boolean;
  private prevMouseX: number;

  constructor(private windowSizeService: WindowSizeService) {}

  ngOnInit() {
    this.isDragging = false;
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event) {
    this.isDragging = true;
    this.prevMouseX = event.clientX;
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event) {
    this.isDragging = false;
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event) {
    if (this.isDragging) {
      const deltaXPixels: number = event.clientX - this.prevMouseX;
      this.prevMouseX = event.clientX;

      this.windowSizeService.adjustWindowWidths(deltaXPixels);
    }
  }
}
