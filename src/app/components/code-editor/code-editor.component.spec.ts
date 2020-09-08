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

    describe('Line bar separator tests', () => {
      it('should create div with class line-bar-separator', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const lineBarClasses = codeEditorElement.getElementsByClassName('line-bar-separator');

        expect(lineBarClasses.length).toBe(1);
      });
    });

    describe('Line number tests', () => {
      it('should create div with class line-number-container', () => {
        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const lineNumberClasses = codeEditorElement.getElementsByClassName('line-number-container');

        expect(lineNumberClasses.length).toBe(1);
      });

      it('should create div with class line-number within line-number-container', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const lineNumberContainer = codeEditorElement.getElementsByClassName('line-number-container')[0];
        const lineNumberClasses = lineNumberContainer.getElementsByClassName('line-number')[0].classList;

        expect(lineNumberClasses[0]).toBe('line-number');
      });

      it('should have textContent of "1" in line-number class', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const lineNumber = codeEditorElement.getElementsByClassName('line-number')[0];

        expect(lineNumber.textContent).toBe('1');
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

  describe('Typescript Tests', () => {
    // TODO: Consider testing the actual KeyBoardEvent of typing which triggers a
    // call to updateLineNumber.
    describe('getLineNumberArray and updateLineNumber tests', () => {
      it('should return a line number array containing single number, 1, when editor is initialised.', () => {

        const expected: number[] = [1];

        expect(component.getLineNumberArray()).toEqual(expected);
      });

      it('should make line number array with two numbers, 1 and 2, where enter was pressed once in the editor.', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegion = codeEditorElement.querySelector('div.input-region');

        inputRegion.innerHTML = '<div><br></div><div><br></div>';
        component.updateLineNumber();

        const expected: number[] = [1, 2];

        expect(component.getLineNumberArray()).toEqual(expected);
      });

      it('should make line number array of numbers from 1 to 5 where 5 lines are written in the editor.', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegion = codeEditorElement.querySelector('div.input-region');

        inputRegion.innerHTML = `<div>Line 1</div>
                                 <div>Line 2</div>
                                 <div>Line 3</div>
                                 <div>Line 4</div>
                                 <div>Line 5</div>`;

        component.updateLineNumber();

        const expected: number[] = [1, 2, 3, 4, 5];

        expect(component.getLineNumberArray()).toEqual(expected);
      });

      it('should make a line number array of numbers from 1 to 3 with 3 lines in the editor, first of which is not in a div tag.', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegion = codeEditorElement.querySelector('div.input-region');

        inputRegion.innerHTML = `Line 1<div>Line 2</div><div>Line 3</div>`;

        component.updateLineNumber();

        const expected: number[] = [1, 2, 3];

        expect(component.getLineNumberArray()).toEqual(expected);
      });

      it('should make a line number array of numbers from 1 to 3 with 3 lines in the editor, last of which is a newline.', () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegion = codeEditorElement.querySelector('div.input-region');

        inputRegion.innerHTML = `<div>Line 1</div><div>Line 2</div><div><br></div>`;

        component.updateLineNumber();

        const expected: number[] = [1, 2, 3];

        expect(component.getLineNumberArray()).toEqual(expected);
      });
    });

    describe('getScrollTop and syncEditorAndLineNumScrolling tests', () => {
      it('should initially have scrollTop be undefined when editor initialised.', () => {
        expect(component.getScrollTop()).toBeUndefined();
      });

      it(`should have getScrollTop return 0 when component's scrollTop is 0 and synced.`, () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegion = codeEditorElement.querySelector('div.input-region');

        inputRegion.scrollTop = 0;

        component.syncEditorAndLineNumScrolling();

        expect(component.getScrollTop()).toBe(0);
      });

      it(`should have getScrollTop return 7 when component's scrollTop is 7 and synced.`, () => {

        const codeEditorElement: HTMLElement = fixture.nativeElement;
        const inputRegion = codeEditorElement.querySelector('div.input-region');

        // Create enough new lines for scrolling to be possible.
        const numberOfNewLines = 30;
        const html: string = Array(numberOfNewLines + 1).join('<div><br></div>');

        inputRegion.innerHTML = html;

        inputRegion.scrollTop = 7;

        component.syncEditorAndLineNumScrolling();

        expect(component.getScrollTop()).toBe(7);
      });
    });
  });
});
