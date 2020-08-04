import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorComponent } from './code-editor.component';

describe('CodeEditorComponent', () => {
  let component: CodeEditorComponent;
  let fixture: ComponentFixture<CodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('HTML tests', () => {
    describe('Main component test', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('Editor heading tests', () => {
      it('should create div with class editor-heading', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const editorHeadingClasses = codeEditorElement.getElementsByClassName('editor-heading');

        expect(editorHeadingClasses.length).toBe(1);
      });

      it(`should have editor-heading with text 'Code'`, () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const editorHeading = codeEditorElement.getElementsByClassName('editor-heading')[0];

        expect(editorHeading.textContent).toBe('Code');
      });
    });

    describe('Input region tests', () => {
      it('should create div with class input-region', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegionClasses = codeEditorElement.getElementsByClassName('input-region');

        expect(inputRegionClasses.length).toBe(1);
      });

      it('should have input-region div which is content editable', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegionClasses = codeEditorElement.getElementsByClassName('input-region');

        expect(inputRegionClasses[0].getAttribute('contenteditable')).toBe('true');
      });
    });
  });
});
