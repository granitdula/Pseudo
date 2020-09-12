import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragBarComponent } from './drag-bar.component';

describe('DragBarComponent', () => {
  let component: DragBarComponent;
  let fixture: ComponentFixture<DragBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragBarComponent ]
    })
    .compileComponents();
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
});
