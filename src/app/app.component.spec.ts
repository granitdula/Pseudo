import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('HTML tests', () => {
    describe('Main component test', () => {
      it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      });
    });

    describe('Navigation bar tests', () => {
      it(`should have as title 'pseudo'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('pseudo');
      });

      it('should contain navbar component', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const navbar = appElement.querySelector('app-navigation-bar');

        expect(navbar).toBeTruthy();
      });
    });

    describe('App body tests', () => {
      it('should have main-section div', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const mainSectionClass = appElement.getElementsByClassName('main-section');

        expect(mainSectionClass.length).toBe(1);
      });

      it('should have div with class col-1 within main-section', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const mainSectionClass = appElement.getElementsByClassName('main-section');
        const divMidSection = mainSectionClass[0].getElementsByClassName('col-1');

        expect(divMidSection.length).toBe(1);
      });

      it('should have div with class mid-section within main-section', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const mainSectionClass = appElement.getElementsByClassName('main-section');
        const divMidSection = mainSectionClass[0].getElementsByClassName('mid-section');

        expect(divMidSection.length).toBe(1);
      });
    });

    describe('Code editor tests', () => {
      it('should contain code editor component', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const codeEditor = appElement.querySelector('app-code-editor');

        expect(codeEditor).toBeTruthy();
      });

      it('should have a col-5 class in the code editor component', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const outputConsoleClasses = appElement.querySelector('app-code-editor').classList;

        expect(outputConsoleClasses[0]).toBe('col-5');
      });
    });

    describe('Output console tests', () => {
      it('should contain output console component', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const outputConsole = appElement.querySelector('app-output-console');

        expect(outputConsole).toBeTruthy();
      });

      it('should have a col-5 class in the output console component', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const outputConsoleClasses = appElement.querySelector('app-output-console').classList;

        expect(outputConsoleClasses[0]).toBe('col-5');
      });
    });

    describe('Drag bar tests', () => {
      it('should contain drag bar component within mid-section div', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const mainSectionClass = appElement.getElementsByClassName('main-section');
        const divMidSection = mainSectionClass[0].getElementsByClassName('mid-section');
        const dragBar = divMidSection[0].querySelector('app-drag-bar');

        expect(dragBar).toBeTruthy();
      });
    });
  });
});
