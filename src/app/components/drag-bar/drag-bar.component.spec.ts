import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragBarComponent } from './drag-bar.component';
import { WindowSizeService } from 'src/app/services/window-size.service';

describe('DragBarComponent', () => {
  let component: DragBarComponent;
  let fixture: ComponentFixture<DragBarComponent>;
  let service: WindowSizeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragBarComponent ]
    })
    .compileComponents();

    service = TestBed.inject(WindowSizeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('HTML tests', () => {
    describe('Main component', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('Line bar tests.', () => {
      it('should create a div with class line-bar.', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;
        const lineBarClasses = dragBarElement.getElementsByClassName('line-bar');

        expect(lineBarClasses.length).toBe(1);
      });

      it('should create a div with class arrow-left.', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;
        const arrowLeftClasses = dragBarElement.getElementsByClassName('arrow-left');

        expect(arrowLeftClasses.length).toBe(1);
      });

      it('should create a div with class arrow-right.', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;
        const arrowRightClasses = dragBarElement.getElementsByClassName('arrow-right');

        expect(arrowRightClasses.length).toBe(1);
      });
    });
  });

  describe('Typescript tests', () => {
    describe('HostListener method call tests.', () => {
      it('should call the onPointerDown method when mouse is down on drag bar position.', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(component, 'onPointerDown');

        const pointerDownEvent = new PointerEvent('pointerdown');

        dragBarElement.dispatchEvent(pointerDownEvent);

        fixture.detectChanges();

        expect(component.onPointerDown).toHaveBeenCalledTimes(1);
      });

      it('should not call the onPointerDown method when mouse is down away from drag bar position.', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(component, 'onPointerDown');

        const pointerDownEvent = new PointerEvent('pointerdown');

        dragBarElement.ownerDocument.dispatchEvent(pointerDownEvent);

        fixture.detectChanges();

        expect(component.onPointerDown).toHaveBeenCalledTimes(0);
      });

      it('should call the onPointerUp method when mouse is up at any position.', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(component, 'onPointerUp');

        const pointerUpEvent = new PointerEvent('pointerup');

        dragBarElement.ownerDocument.dispatchEvent(pointerUpEvent);

        fixture.detectChanges();

        expect(component.onPointerUp).toHaveBeenCalledTimes(1);
      });

      it('should call the onPointerMove method when mouse is moving at any position.', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(component, 'onPointerMove');

        const pointerMoveEvent = new PointerEvent('pointermove');

        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);

        fixture.detectChanges();

        expect(component.onPointerMove).toHaveBeenCalledTimes(1);
      });
    });

    describe('adjustWindowWidths call tests', () => {
      it('should call adjustWindowWidths once if pointer is down and then moving', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(service, 'adjustWindowWidths');

        const pointerDownEvent = new PointerEvent('pointerdown');
        const pointerMoveEvent = new PointerEvent('pointermove');

        dragBarElement.dispatchEvent(pointerDownEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(1);
      });

      it('should call adjustWindowWidths twice if pointer is down, then moving, then up, twice', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(service, 'adjustWindowWidths');

        const pointerDownEvent = new PointerEvent('pointerdown');
        const pointerMoveEvent = new PointerEvent('pointermove');
        const pointerUpEvent = new PointerEvent('pointerup');

        dragBarElement.dispatchEvent(pointerDownEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerUpEvent);
        dragBarElement.dispatchEvent(pointerDownEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerUpEvent);

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(2);
      });

      it('should call adjustWindowWidths three times if pointer is down and then moving three times', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(service, 'adjustWindowWidths');

        const pointerDownEvent = new PointerEvent('pointerdown');
        const pointerMoveEvent = new PointerEvent('pointermove');

        dragBarElement.dispatchEvent(pointerDownEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(3);
      });

      it('should call adjustWindowWidths once if pointer is down, then moves, then goes up, then moves', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(service, 'adjustWindowWidths');

        const pointerDownEvent = new PointerEvent('pointerdown');
        const pointerMoveEvent = new PointerEvent('pointermove');
        const pointerUpEvent = new PointerEvent('pointerup');

        dragBarElement.dispatchEvent(pointerDownEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerUpEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(1);
      });

      it('should not call adjustWindowWidths if pointer is down without moving', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(service, 'adjustWindowWidths');

        const pointerDownEvent = new PointerEvent('pointerdown');

        dragBarElement.dispatchEvent(pointerDownEvent);

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(0);
      });

      it('should not call adjustWindowWidths if pointer is down then immediately up', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(service, 'adjustWindowWidths');

        const pointerDownEvent = new PointerEvent('pointerdown');
        const pointerUpEvent = new PointerEvent('pointerup');

        dragBarElement.dispatchEvent(pointerDownEvent);
        dragBarElement.ownerDocument.dispatchEvent(pointerUpEvent);

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(0);
      });

      it('should not call adjustWindowWidths if pointer moving without being down', () => {

        const dragBarElement: HTMLElement = fixture.nativeElement;

        spyOn(service, 'adjustWindowWidths');

        const pointerMoveEvent = new PointerEvent('pointermove');

        dragBarElement.ownerDocument.dispatchEvent(pointerMoveEvent);

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(0);
      });

      it('should not call adjustWindowWidths no event occurs', () => {

        spyOn(service, 'adjustWindowWidths');

        fixture.detectChanges();

        expect(service.adjustWindowWidths).toHaveBeenCalledTimes(0);
      });
    });
  });
});
