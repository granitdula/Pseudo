import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunButtonComponent } from './run-button.component';

describe('RunButtonComponent', () => {
  let component: RunButtonComponent;
  let fixture: ComponentFixture<RunButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('HTML tests', () => {
    describe('Main component test', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('img div tests', () => {
      it('should contain an img div', () => {

        const runButtonElement: HTMLElement = fixture.nativeElement;
        const img = runButtonElement.querySelector('img');

        expect(img).toBeTruthy();
      });

      it('should contain run-btn-img class in img', () => {

        const runButtonElement: HTMLElement = fixture.nativeElement;
        const imgClasses = runButtonElement.querySelector('img').classList;

        expect(imgClasses[0]).toBe('run-btn-img');
      });
    });
  });
});
