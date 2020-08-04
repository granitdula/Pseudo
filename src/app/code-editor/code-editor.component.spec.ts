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

    describe('Code editor tests', () => {
      it('should create div of class code-editor', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const codeEditorClasses = codeEditorElement.getElementsByClassName('code-editor');

        expect(codeEditorClasses.length).toBe(1);
      });

      it('should create div within code-editor div called input-region', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const codeEditorClasses = codeEditorElement.getElementsByClassName('code-editor');
        const inputRegionClasses = codeEditorClasses[0].getElementsByClassName('input-region');

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
