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
    });

    describe('Code editor tests', () => {
      it('should contain code editor component', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const codeEditor = appElement.querySelector('app-code-editor');

        expect(codeEditor).toBeTruthy();
      });

      it('should have a col-5 class in the code editor component', () => {

        const appElement: HTMLElement = fixture.nativeElement;
        const codeEditorClasses = appElement.querySelector('app-code-editor').classList;

        expect(codeEditorClasses[0]).toBe('col-5');
      });
    });
  });
});
